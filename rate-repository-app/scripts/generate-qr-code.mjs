/**
 * Generates the QR code image (qr-code.png) at the root of the repository.
 *
 * The QR code encodes the Expo Go deep link of the `main` branch of the
 * published EAS Update project:
 *
 *   exp://u.expo.dev/<projectId>?channel-name=main&runtime-version=<runtimeVersion>
 *
 * The deep-link parameters match the project id of app.json, the `main`
 * channel configured in eas.json and the runtime version used by the update
 * ("1.0.0" because app.json uses the appVersion runtime version policy).
 *
 * Usage from the rate-repository-app directory:
 *
 *   npm install --no-save --no-audit --no-fund qrcode jsqr pngjs
 *   node scripts/generate-qr-code.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';

const APP_DIRECTORY = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const REPOSITORY_ROOT = path.resolve(APP_DIRECTORY, '..');

const PROJECT_ID = 'b4c2ae0e-c003-4858-9b91-36462fd79c15';
const CHANNEL = 'main';
const RUNTIME_VERSION = '1.0.0';

const deepLink = new URL(`exp://u.expo.dev/${PROJECT_ID}`);
deepLink.searchParams.set('channel-name', CHANNEL);
deepLink.searchParams.set('runtime-version', RUNTIME_VERSION);

const QR_FILE = path.join(REPOSITORY_ROOT, 'qr-code.png');

console.log(`Expo Go deep link: ${deepLink}`);

const pngBuffer = await QRCode.toBuffer(deepLink.toString(), {
  width: 600,
  margin: 2,
});

fs.writeFileSync(QR_FILE, pngBuffer);

console.log(`Wrote ${QR_FILE} (${pngBuffer.length} bytes)`);

// Double check that the generated PNG really decodes to the deep link.
const png = PNG.sync.read(fs.readFileSync(QR_FILE));
const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

if (!decoded || decoded.data !== deepLink.toString()) {
  console.error('Expected the generated QR code to decode to the deep link');
  process.exit(1);
}

console.log(`QR code size: ${decoded.location ? '' : ''}${png.width}x${png.height}`);
console.log(`QR code decodes to: ${decoded.data}`);
