import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign, verify } from 'hono/jwt'

// Bindings for Cloudflare resources
type Bindings = {
  portfolio_db: D1Database
  STORAGE: R2Bucket
  ADMIN_PASSWORD?: string
  JWT_SECRET?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Handle CORS
app.use('/*', cors({
  origin: ['http://localhost:5173', 'https://isabelfinaldi-ph.vercel.app', 'https://naitiry.vercel.app', 'https://naitiry.com', 'https://www.naitiry.com'], // Replace with frontend URL
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  exposeHeaders: ['Content-Length', 'x-custom-header'],
  maxAge: 600,
  credentials: true,
}))

// Validate auth on all /admin/* endpoints except /admin/login
app.use('/admin/*', async (c, next) => {
  if (c.req.path === '/admin/login' || c.req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: `Unauthorized: Missing or invalid Authorization header. Got: ${authHeader || 'null'}` }, 401);
  }

  const token = authHeader.split(' ')[1];
  const secret = c.env.JWT_SECRET || 'fallback-secret-for-dev';

  try {
    // Validate token
    await verify(token, secret, "HS256");
    await next();
  } catch (err: any) {
    return c.json({ error: `Invalid or expired token: ${err.message || 'Unknown error'}` }, 401);
  }
})

// POST /admin/login
app.post('/admin/login', async (c) => {
  try {
    const { password } = await c.req.json();
    const currentPassword = c.env.ADMIN_PASSWORD || 'localdev';

    if (password !== currentPassword) {
      return c.json({ error: 'Invalid password' }, 401);
    }

    // Generate JWT (Valid for 30 days)
    const secret = c.env.JWT_SECRET || 'fallback-secret-for-dev';
    const payload = {
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    };

    const token = await sign(payload, secret, "HS256");
    return c.json({ token });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
})

// GET /photos
app.get('/photos', async (c) => {
  try {
    const { results } = await c.env.portfolio_db.prepare(
      "SELECT * FROM photos ORDER BY created_at DESC"
    ).all()

    // Convert JSON strings back to arrays if needed for photomodel
    const formattedPhotos = results.map((row: any) => {
      let photomodel: string[] = []
      try {
        if (row.photomodel) {
          photomodel = JSON.parse(row.photomodel)
        }
      } catch (e) {
        // Fallback for comma-separated or invalid JSON
        photomodel = typeof row.photomodel === 'string' ? row.photomodel.split(',').map((m: string) => m.trim()) : []
      }

      return {
        id: row.id,
        title: row.title,
        category: row.category,
        shooting_name: row.shooting_name,
        photomodel,
        date: row.date,
        featured: !!row.featured,
        votes: row.votes,
        storage_id: row.storage_id,
        src: row.src,
        created_at: row.created_at
      }
    });

    return c.json({ data: { photos: formattedPhotos } })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// For serving the actual image if you don't use a custom domain for the R2 bucket directly
app.get('/images/:id', async (c) => {
  const id = c.req.param('id')
  const object = await c.env.STORAGE.get(id)

  if (object === null) {
    return new Response('Object Not Found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  
  // Explicitly ensure Content-Type is set so Cloudflare Image Resizing works
  // R2 usually sets this if it was provided on upload, but let's be explicit just in case
  const contentType = object.httpMetadata?.contentType || 'image/jpeg'
  headers.set('Content-Type', contentType)
  headers.set('Cache-Control', 'public, max-age=31536000')

  return new Response(object.body, { headers })
})

// POST /upload (Admin only)
app.post('/admin/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File | null
    if (!file) return c.json({ error: 'No file uploaded' }, 400)

    // Parse metadata
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const shooting_name = formData.get('shootingName') as string || null
    const photomodelstr = formData.get('photomodel') as string || '' // Comma separated
    const date = formData.get('date') as string
    const featured = formData.get('featured') === 'true' ? 1 : 0
    const votes = parseInt(formData.get('votes') as string || '0', 10)

    // Prepare arrays/ids
    const photomodelArray = photomodelstr.split(',').map(m => m.trim()).filter(Boolean)
    const photomodel = JSON.stringify(photomodelArray)
    const storage_id = crypto.randomUUID()
    const id = crypto.randomUUID()

    // Upload file to R2
    // Storing with the storage_id as the key
    await c.env.STORAGE.put(storage_id, file.stream(), {
      httpMetadata: { contentType: file.type },
    })

    // Create the public URL (replace with custom domain if attached to R2)
    const hostname = new URL(c.req.url).origin
    const src = `${hostname}/images/${storage_id}`

    // Insert into D1
    await c.env.portfolio_db.prepare(`
      INSERT INTO photos (id, title, category, shooting_name, photomodel, date, featured, votes, storage_id, src)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, title, category, shooting_name, photomodel, date, featured, votes, storage_id, src).run()

    return c.json({ data: { id, src } })
  } catch (e: any) {
    console.error(e)
    return c.json({ error: e.message }, 500)
  }
})

// PUT /photos/:id (Admin only)
app.put('/admin/photos/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()

    // Example body matching what the frontend sends
    const title = body.title
    const category = body.category
    const shooting_name = body.shootingName || null
    const photomodelstr = body.photomodel || '' // Comma separated 
    const date = body.date
    const featured = body.featured ? 1 : 0

    const photomodelArray = photomodelstr.split(',').map((m: string) => m.trim()).filter(Boolean)
    const photomodel = JSON.stringify(photomodelArray)

    await c.env.portfolio_db.prepare(`
      UPDATE photos 
      SET title = ?, category = ?, shooting_name = ?, photomodel = ?, date = ?, featured = ?
      WHERE id = ?
    `).bind(title, category, shooting_name, photomodel, date, featured, id).run()

    return c.json({ success: true, id })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

// DELETE /photos/:id (Admin only)
app.delete('/admin/photos/:id', async (c) => {
  try {
    const id = c.req.param('id')

    // Get the photo to find the storage_id
    const photo = await c.env.portfolio_db.prepare('SELECT storage_id FROM photos WHERE id = ?').bind(id).first()
    if (!photo) return c.json({ error: 'Photo not found' }, 404)

    const storage_id = photo.storage_id as string

    // 1. Delete from R2
    await c.env.STORAGE.delete(storage_id)

    // 2. Delete from D1
    await c.env.portfolio_db.prepare('DELETE FROM photos WHERE id = ?').bind(id).run()

    return c.json({ success: true })
  } catch (e: any) {
    return c.json({ error: e.message }, 500)
  }
})

app.get('/', (c) => c.text('Cloudflare API for Photos is running!'))

export default app
