import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'public', 'images');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const input = path.join(dir, file);
  const output = path.join(dir, file.replace('.png', '.webp'));
  const stats = fs.statSync(input);

  await sharp(input)
    .webp({ quality: 80 })
    .toFile(output);

  const newStats = fs.statSync(output);
  const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);
  console.log(`${file} -> ${file.replace('.png', '.webp')} | ${(stats.size / 1024).toFixed(0)}KB -> ${(newStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`);
}
console.log('Done!');
