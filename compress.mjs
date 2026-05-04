import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const dirs = [
  'public/images/baby',
  'public/images/cafe',
  'public/images/Department'
];

async function compressDir(dir) {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue;
      const filePath = path.join(dir, file);
      const tmpPath = filePath + '.tmp';
      
      console.log(`Compressing ${filePath}...`);
      try {
        let pipeline = sharp(filePath);
        
        // Auto-orient and compress based on extension
        if (file.match(/\.(jpg|jpeg)$/i)) {
          pipeline = pipeline.jpeg({ quality: 75, mozjpeg: true });
        } else if (file.match(/\.png$/i)) {
          pipeline = pipeline.png({ quality: 75, compressionLevel: 9 });
        } else if (file.match(/\.webp$/i)) {
          pipeline = pipeline.webp({ quality: 75 });
        }

        // Resize if it's too large (e.g., width > 1920)
        const metadata = await sharp(filePath).metadata();
        if (metadata.width && metadata.width > 1920) {
          pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
        }

        await pipeline.toFile(tmpPath);
        
        const origStats = await fs.stat(filePath);
        const newStats = await fs.stat(tmpPath);
        
        const saving = ((origStats.size - newStats.size) / origStats.size * 100).toFixed(1);
        console.log(`  Reduced from ${(origStats.size/1024/1024).toFixed(2)}MB to ${(newStats.size/1024/1024).toFixed(2)}MB (-${saving}%)`);
        
        await fs.rename(tmpPath, filePath);
      } catch (e) {
        console.error(`Error compressing ${filePath}:`, e.message);
        try { await fs.unlink(tmpPath); } catch (e2) {}
      }
    }
  } catch (err) {
    console.error(`Error reading dir ${dir}:`, err.message);
  }
}

async function main() {
  for (const dir of dirs) {
    const fullDir = path.join(process.cwd(), dir);
    console.log(`\nProcessing directory: ${dir}`);
    await compressDir(fullDir);
  }
}

main().catch(console.error);
