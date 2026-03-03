import { nhost } from '../nhost';

// ── GraphQL helpers ──────────────────────────────────────────────────────────

const GQL = async (query, variables = {}) => {
  const session = nhost.getUserSession();
  const headers = { 'Content-Type': 'application/json' };
  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
    // Explicitly request the user role; sometimes Hasura defaults to public if not told
    headers['x-hasura-role'] = 'user';
  }
  const res = await nhost.graphql.request({ query, variables }, { headers });
  if (res.body?.errors) throw new Error(res.body.errors[0]?.message ?? 'GraphQL error');
  return res.body.data;
};

// ── Public: fetch all uploaded photos ────────────────────────────────────────

const FETCH_PHOTOS_QUERY = `
  query FetchPhotos {
    photos(order_by: { created_at: desc }) {
      id
      title
      category
      shooting_name
      photomodel
      date
      featured
      votes
      storage_id
      src
    }
  }
`;

export async function fetchNhostPhotos() {
  const data = await GQL(FETCH_PHOTOS_QUERY);
  // Normalize snake_case → camelCase to match existing photo shape
  return (data?.photos ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    shootingName: p.shooting_name,
    // Provide array directly. Hasura returns string '{model1,model2}' or actual JSON array depending on setup.
    // If it comes back as string array literal "{a, b}", we parse it. But standard GraphQL returns an array.
    photomodel: Array.isArray(p.photomodel) ? p.photomodel : (p.photomodel ? p.photomodel.replace(/^\{|\}$/g, '').split(',').map(m => m.trim()) : []),
    date: p.date,
    featured: p.featured,
    votes: p.votes,
    storageId: p.storage_id,
    src: p.src,
    fromNhost: true,
  }));
}

// ── Admin: upload image to Storage + insert row ───────────────────────────────

export async function uploadPhoto(file, meta) {
  let uploadBody;
  try {
    const session = nhost.getUserSession();
    const headers = {};
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    const res = await nhost.storage.uploadFiles({
      'file[]': [file],
      'bucket-id': 'default'
    }, { headers });
    uploadBody = res.body;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(error.message ?? 'Upload failed');
  }

  // In v4, uploadFiles typically returns an object with `processedFiles` array
  const files = uploadBody?.processedFiles || uploadBody;
  const storageFile = Array.isArray(files) ? files[0] : files;
  const storageId = storageFile?.id;

  if (!storageId) {
    console.error("Nhost upload response:", uploadBody);
    throw new Error("Impossibile recuperare l'ID del file caricato dallo storage.");
  }

  // Build public URL: Nhost Storage public URL pattern
  const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN;
  const region = import.meta.env.VITE_NHOST_REGION;
  const src = `https://${subdomain}.storage.${region}.nhost.run/v1/files/${storageId}`;

  // 2. Insert metadata row via GraphQL
  const INSERT = `
    mutation InsertPhoto($obj: photos_insert_input!) {
      insert_photos_one(object: $obj) { id }
    }
  `;
  const obj = {
    title: meta.title,
    category: meta.category,
    shooting_name: meta.shootingName ?? null,
    // Convert comma-separated string from the UI to a real array
    photomodel: meta.photomodel
      ? meta.photomodel.split(',').map(m => m.trim()).filter(Boolean)
      : [],
    date: meta.date,
    featured: meta.featured ?? false,
    votes: meta.votes ?? 0,
    storage_id: storageId,
    src,
  };
  const data = await GQL(INSERT, { obj });
  return data?.insert_photos_one?.id;
}

// ── Admin: update metadata only ───────────────────────────────────────────────

export async function updateNhostPhoto(id, meta) {
  const UPDATE = `
    mutation UpdatePhoto($id: uuid!, $set: photos_set_input!) {
      update_photos_by_pk(pk_columns: { id: $id }, _set: $set) { id }
    }
  `;
  const set = {
    title: meta.title,
    category: meta.category,
    shooting_name: meta.shootingName ?? null,
    // Convert comma-separated string from the UI to a real array
    photomodel: meta.photomodel
      ? meta.photomodel.split(',').map(m => m.trim()).filter(Boolean)
      : [],
    date: meta.date,
    featured: meta.featured ?? false,
  };
  await GQL(UPDATE, { id, set });
}

// ── Admin: delete file + row ──────────────────────────────────────────────────

export async function deleteNhostPhoto(id, storageId) {
  try {
    const session = nhost.getUserSession();
    const headers = {};
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
    await nhost.storage.deleteFile(storageId, { headers });
  } catch (error) {
    console.error("Delete file error:", error);
    // best-effort; proceed to delete row even if file is already gone
  }
  // Delete metadata row
  const DELETE = `
    mutation DeletePhoto($id: uuid!) {
      delete_photos_by_pk(id: $id) { id }
    }
  `;
  await GQL(DELETE, { id });
}
