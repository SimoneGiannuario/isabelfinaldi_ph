import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, '../src/assets/images/logo1.png');
const outputPath = path.resolve(__dirname, '../src/assets/images/logo1.webp');

async function optimizeLogo() {
  try {
    await sharp(inputPath)
      .resize(300)
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log('Successfully optimized logo to WebP at 300px width');
  } catch (error) {
    console.error('Error optimizing logo:', error);
  }
}

optimizeLogo();
