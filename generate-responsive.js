import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'public', 'images');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp') && !f.includes('-'));

const SIZES = [400, 800, 1200];

for (const file of files) {
  const input = path.join(dir, file);

  for (const size of SIZES) {
    const output = path.join(dir, file.replace('.webp', `-${size}w.webp`));
    await sharp(input)
      .resize(size)
      .webp({ quality: 85 })
      .toFile(output);
    console.log(`Generated ${output}`);
  }
}
console.log('Responsive images generated!');
