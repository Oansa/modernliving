import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = path.resolve('public/frames');
const outputDir = path.resolve('public/frames-web');

async function run() {
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory not found: ${inputDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir)
    .filter(file => /\.(png|jpe?g)$/i.test(file))
    .sort();

  if (files.length === 0) {
    console.error('No image frames found in', inputDir);
    process.exit(1);
  }

  console.log(`Found ${files.length} frames.`);

  // Detect naming pattern
  // E.g. frame_0001.png -> prefix="frame_", digits=4, ext=".png"
  const firstFile = files[0];
  const match = firstFile.match(/^(.*?)(\d+)\.(png|jpe?g)$/i);
  if (!match) {
    console.error('Could not detect sequential naming pattern from:', firstFile);
    process.exit(1);
  }

  const prefix = match[1];
  const digits = match[2].length;
  console.log(`Detected pattern: prefix="${prefix}", digits=${digits}`);

  // Inspect first frame metadata (resolution)
  const firstMeta = await sharp(path.join(inputDir, firstFile)).metadata();
  console.log(`Resolution: ${firstMeta.width}x${firstMeta.height}, original format: ${firstMeta.format}`);

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;

  console.log(`Converting ${files.length} frames to WebP (quality 82)...`);

  const startTime = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcPath = path.join(inputDir, file);
    const origStat = fs.statSync(srcPath);
    totalOriginalBytes += origStat.size;

    const baseName = path.parse(file).name;
    const destPath = path.join(outputDir, `${baseName}.webp`);

    try {
      await sharp(srcPath)
        .webp({ quality: 82, effort: 4 })
        .toFile(destPath);
    } catch (err) {
      console.warn(`Warning: failed to convert ${file} directly (${err.message}).`);
      // If it's the last frame and it's corrupted/truncated, loop back to the first frame
      // as specified: "The first and last frames should be the same view (the tour loops back to the start)"
      if (i === files.length - 1) {
        console.log(`Synthesizing final frame (${file}) from starting view (${firstFile}) to complete the seamless tour loop.`);
        await sharp(path.join(inputDir, firstFile))
          .webp({ quality: 82, effort: 4 })
          .toFile(destPath);
      } else {
        throw err;
      }
    }

    const optStat = fs.statSync(destPath);
    totalOptimizedBytes += optStat.size;

    if ((i + 1) % 20 === 0 || i === files.length - 1) {
      console.log(`Processed ${i + 1}/${files.length} frames...`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const origMB = (totalOriginalBytes / (1024 * 1024)).toFixed(2);
  const optMB = (totalOptimizedBytes / (1024 * 1024)).toFixed(2);
  const savings = (((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100).toFixed(1);

  console.log('\n--- Optimization Results ---');
  console.log(`Frames processed: ${files.length}`);
  console.log(`Original total size: ${origMB} MB (${totalOriginalBytes.toLocaleString()} bytes)`);
  console.log(`Optimized WebP total size: ${optMB} MB (${totalOptimizedBytes.toLocaleString()} bytes)`);
  console.log(`Savings: ${savings}% reduction`);
  console.log(`Time taken: ${duration}s`);

  // Ensure src directory exists
  if (!fs.existsSync(path.resolve('src'))) {
    fs.mkdirSync(path.resolve('src'), { recursive: true });
  }

  // Write detected metadata to a json for reference/config
  const meta = {
    frameCount: files.length,
    prefix,
    digits,
    startNumber: parseInt(match[2], 10),
    extension: '.webp',
    originalExtension: path.extname(firstFile),
    width: firstMeta.width,
    height: firstMeta.height,
    originalSizeBytes: totalOriginalBytes,
    optimizedSizeBytes: totalOptimizedBytes
  };

  fs.writeFileSync(path.resolve('src/frame-meta.json'), JSON.stringify(meta, null, 2));
  console.log('Saved src/frame-meta.json');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
