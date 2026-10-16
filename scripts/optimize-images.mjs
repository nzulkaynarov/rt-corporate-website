import fs from 'node:fs';
import path from 'node:path';

/**
 * Build-time image optimization script.
 * Walks through public/images and public/uploads.
 * Compresses images > 250KB or > 1600px width using sharp.
 * Failsafe: Wrapped in try/catch so build never crashes.
 */
async function main() {
  console.log('[optimize-images] Checking images for optimization...');

  let sharp;
  try {
    const sharpModule = await import('sharp');
    sharp = sharpModule.default;
  } catch (err) {
    console.warn('[optimize-images] Sharp is not available, skipping image compression.', err?.message);
    return;
  }

  const rootDir = process.cwd();
  const targetDirs = [
    path.join(rootDir, 'public', 'images'),
    path.join(rootDir, 'public', 'uploads'),
  ];

  const extensions = new Set(['.jpg', '.jpeg', '.png']);
  const MAX_WIDTH = 1600;
  const SIZE_THRESHOLD_BYTES = 250 * 1024; // 250 KB

  function getFilesRecursively(dir) {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getFilesRecursively(fullPath));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.has(ext)) {
          files.push(fullPath);
        }
      }
    }
    return files;
  }

  let totalChecked = 0;
  let totalOptimized = 0;
  let bytesSaved = 0;

  for (const dir of targetDirs) {
    const files = getFilesRecursively(dir);
    for (const filePath of files) {
      totalChecked++;
      try {
        const stats = fs.statSync(filePath);
        const metadata = await sharp(filePath).metadata();

        const needsResize = (metadata.width && metadata.width > MAX_WIDTH);
        const needsCompression = stats.size > SIZE_THRESHOLD_BYTES;

        if (needsResize || needsCompression) {
          const originalSize = stats.size;
          let transformer = sharp(filePath);

          if (needsResize) {
            transformer = transformer.resize({
              width: MAX_WIDTH,
              withoutEnlargement: true,
            });
          }

          let optimizedBuffer;
          const ext = path.extname(filePath).toLowerCase();

          if (ext === '.png' && !needsCompression && !needsResize) {
            continue;
          }

          // Convert/optimize to progressive JPEG at quality 82
          optimizedBuffer = await transformer
            .jpeg({ quality: 82, progressive: true, mozjpeg: true })
            .toBuffer();

          if (optimizedBuffer.length < originalSize) {
            fs.writeFileSync(filePath, optimizedBuffer);
            totalOptimized++;
            bytesSaved += (originalSize - optimizedBuffer.length);
            console.log(
              `[optimize-images] Optimized: ${path.relative(rootDir, filePath)} ` +
              `(${(originalSize / 1024).toFixed(1)} KB → ${(optimizedBuffer.length / 1024).toFixed(1)} KB)`
            );
          }
        }
      } catch (fileErr) {
        console.warn(`[optimize-images] Warning processing ${filePath}:`, fileErr?.message);
      }
    }
  }

  console.log(
    `[optimize-images] Completed. Scanned: ${totalChecked}, Optimized: ${totalOptimized}, ` +
    `Saved: ${(bytesSaved / 1024 / 1024).toFixed(2)} MB.`
  );
}

main().catch((err) => {
  console.warn('[optimize-images] Unexpected top-level error (ignoring to prevent build halt):', err);
});
