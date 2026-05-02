import sharp from "sharp";
import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { url, w } = req.query;

    if (!url) {
      res.status(400).json({ error: "Missing ?url=" });
      return;
    }

    const width = w ? parseInt(w, 10) : null;

    // ETag basato su URL + width
    const etag = crypto
      .createHash("md5")
      .update(url + (width || ""))
      .digest("hex");

    // Risposta 304 se il client ha già la versione cacheata
    if (req.headers["if-none-match"] === etag) {
      res.status(304).end();
      return;
    }

    // Scarica immagine originale
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    // Pipeline Sharp
    let pipeline = sharp(buffer).rotate();

    if (width) {
      pipeline = pipeline.resize({ width });
    }

    pipeline = pipeline.webp({ quality: 85 });

    // Headers di caching
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("ETag", etag);

    // STREAMING: invia i byte mentre vengono generati
    pipeline.pipe(res);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
