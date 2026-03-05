import sharp from "sharp";

export default async function handler(req, res) {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing ?url=" });
    }

    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());

    let pipeline = sharp(buffer);

    const webp = await pipeline
      .webp({ quality: 80 })
      .toBuffer();

    res.setHeader("Content-Type", "image/webp");
    res.send(webp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
