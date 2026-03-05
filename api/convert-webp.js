import sharp from "sharp";

export default async function handler(req, res) {
  try {
    const { url, w } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    const width = w ? parseInt(w, 10) : null;

    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    let pipeline = sharp(buffer);

    if (width) {
      pipeline = pipeline.resize({ width });
    }

    const webp = await pipeline
      .webp({ quality: 80 })
      .toBuffer();

    res.setHeader("Content-Type", "image/webp");
    res.send(webp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
