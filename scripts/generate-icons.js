import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateIcons() {
  const svgPath = path.resolve('public/kiki-robot.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { file: 'public/icon.png', size: 512 },
    { file: 'public/pwa-512x512.png', size: 512 },
    { file: 'public/pwa-192x192.png', size: 192 },
    { file: 'public/apple-touch-icon.png', size: 180 },
    { file: 'public/favicon.png', size: 64 },
  ];

  for (const target of targets) {
    await sharp(svgBuffer)
      .resize(target.size, target.size)
      .png()
      .toFile(path.resolve(target.file));
    console.log(`Generated: ${target.file} (${target.size}x${target.size})`);
  }

  // Generate maskable icon with 15% safe padding
  const paddedSize = Math.round(512 * 0.8);
  const innerPng = await sharp(svgBuffer)
    .resize(paddedSize, paddedSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 7, g: 12, b: 20, alpha: 1 }
    }
  })
    .composite([{ input: innerPng, gravity: 'center' }])
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));

  console.log('Generated: public/pwa-maskable-512x512.png (512x512 maskable)');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
