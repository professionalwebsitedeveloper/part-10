/**
 * Verifies the deliverables of Exercise 28 ("Publishing the app via EAS Publish").
 *
 * The script checks that
 *
 *   1. app.json is configured as an EAS Update project, that is, it contains the
 *      updates.url and extra.eas.projectId written by
 *      `npx eas-cli@latest update:configure`,
 *   2. the README.md at the root of the repository embeds a screenshot of the QR
 *      code of the published update,
 *   3. the QR code is a real Expo Go deep link (exp://u.expo.dev/...) that points
 *      to the EAS project of app.json and to its `main` branch,
 *   4. the EAS Update servers really serve the update the QR code points to,
 *      which is exactly what the course instructor scans to open the
 *      application with Expo Go, and
 *   5. the pre-deployed Rate Repository API, which is the backend of the
 *      published application, responds.
 *
 * Usage from the rate-repository-app directory:
 *
 *   npm install --no-save jsqr pngjs
 *   node scripts/verify-eas-update.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import jsQR from 'jsqr';
import { PNG } from 'pngjs';

const APP_DIRECTORY = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const REPOSITORY_ROOT = path.resolve(APP_DIRECTORY, '..');

const RATE_REPOSITORY_API =
  'https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi';

const checks = [];

const check = (condition, message) => {
  const passed = Boolean(condition);
  checks.push({ passed, message });
  console.log(`  ${passed ? 'ok  ' : 'FAIL'}  ${message}`);
  return passed;
};

const required = (condition, message) => {
  if (!check(condition, message)) {
    console.error(
      `\n${checks.filter(({ passed }) => !passed).length} check(s) failed`,
    );
    process.exit(1);
  }
};

const readText = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');

const readJson = (file) => JSON.parse(readText(file));

const imageReferencesFrom = (markdown) =>
  [
    ...markdown.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)/g),
    ...markdown.matchAll(/<img[^>]*?\ssrc=["']([^"']+)["']/g),
  ].map((match) => match[1]);

const decodeQrCode = (file) => {
  const png = PNG.sync.read(fs.readFileSync(file));
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

  return {
    content: decoded ? decoded.data : null,
    width: png.width,
    height: png.height,
  };
};

// The runtimeVersion of app.json can be a string or a policy such as
// { "policy": "appVersion" }.
const runtimeVersionOf = (expoConfig) => {
  const { runtimeVersion } = expoConfig;

  if (typeof runtimeVersion === 'string') {
    return runtimeVersion;
  }

  if (runtimeVersion?.policy === 'appVersion') {
    return expoConfig.version;
  }

  if (runtimeVersion?.policy === 'sdkVersion') {
    return `exposdk:${expoConfig.sdkVersion}`;
  }

  return undefined;
};

// ------------------------------------------ 1. the EAS Update configuration

console.log('\nEAS Update configuration');

const expoConfig = readJson(path.join(APP_DIRECTORY, 'app.json')).expo ?? {};
const projectId = expoConfig.extra?.eas?.projectId;
const updatesUrl = expoConfig.updates?.url;
const runtimeVersion = runtimeVersionOf(expoConfig);

required(
  typeof projectId === 'string' && projectId.length > 0,
  'app.json contains extra.eas.projectId (npx eas-cli@latest update:configure)',
);
required(
  typeof updatesUrl === 'string' && updatesUrl.includes(projectId),
  `app.json updates.url points to the EAS project (${updatesUrl})`,
);
required(
  typeof runtimeVersion === 'string' && runtimeVersion.length > 0,
  `app.json declares a runtimeVersion (${runtimeVersion})`,
);

// ------------------------------------------- 2. the QR code of the README.md

console.log('\nREADME.md');

const readmePath = path.join(REPOSITORY_ROOT, 'README.md');
required(
  fs.existsSync(readmePath),
  'README.md exists at the root of the repository',
);

const readme = readText(readmePath);
const imageReferences = imageReferencesFrom(readme);
required(imageReferences.length > 0, 'README.md embeds an image of the QR code');

const qrCodes = imageReferences
  .filter((reference) => !/^[a-z][a-z0-9+.-]*:\/\//i.test(reference))
  .map((reference) => ({
    reference,
    file: path.resolve(REPOSITORY_ROOT, reference),
  }))
  .filter(({ file }) => {
    if (fs.existsSync(file)) {
      return true;
    }

    console.error(`  ..    the image ${file} does not exist`);
    return false;
  })
  .map(({ reference, file }) => {
    try {
      return { reference, ...decodeQrCode(file) };
    } catch (error) {
      console.error(`  ..    ${reference} is not a PNG image: ${error.message}`);
      return { reference, content: null, width: 0, height: 0 };
    }
  });

const qrCode = qrCodes.find(({ content }) =>
  (content ?? '').startsWith('exp://u.expo.dev/'),
);

required(
  qrCode !== undefined,
  'README.md embeds a QR code that opens the application with Expo Go (exp://u.expo.dev/...)',
);
required(
  qrCode.width >= 200 && qrCode.height >= 200,
  `the QR code image is large enough to be scanned (${qrCode.width}x${qrCode.height})`,
);

console.log(`  ..    the QR code of README.md decodes to ${qrCode.content}`);

const deepLink = new URL(qrCode.content.replace(/^exp:/, 'http:'));
const qrProjectId = deepLink.pathname.replace(/^\/+/, '');
const qrChannel = deepLink.searchParams.get('channel-name');
const qrRuntimeVersion =
  deepLink.searchParams.get('runtime-version') ?? runtimeVersion;

required(
  qrProjectId === projectId,
  `the QR code points to the EAS project of app.json (${qrProjectId})`,
);
required(
  qrChannel === 'main',
  `the QR code points to the main branch of the EAS Update project (${qrChannel})`,
);
required(
  typeof qrRuntimeVersion === 'string' && qrRuntimeVersion.length > 0,
  `the QR code declares the runtime version of the application (${qrRuntimeVersion})`,
);

// ---------------------------------------- 3. the published update is served

console.log('\nEAS Update servers');

const manifestUrl = new URL(`https://u.expo.dev/${projectId}`);
manifestUrl.searchParams.set('channel-name', qrChannel);
manifestUrl.searchParams.set('runtime-version', qrRuntimeVersion);
manifestUrl.searchParams.set('platform', 'android');

const manifestResponse = await fetch(manifestUrl, {
  headers: {
    // EAS Update answers with a multipart/mixed document when the client
    // supports it, exactly like the expo-updates library of the application.
    accept: 'multipart/mixed,application/expo+json,application/json',
    'expo-platform': 'android',
    'expo-runtime-version': qrRuntimeVersion,
    'expo-channel-name': qrChannel,
  },
});
const manifestBody = await manifestResponse.text();

console.log(`  ..    GET ${manifestUrl} -> ${manifestResponse.status}`);

const manifestServed = check(
  manifestResponse.status === 200,
  `the EAS Update servers serve the update opened by the QR code (HTTP ${manifestResponse.status})`,
);

if (manifestServed) {
  check(
    manifestBody.includes('launchAsset'),
    'the manifest contains the JavaScript bundle (launchAsset) of the application',
  );
} else {
  console.error(
    `  ..    ${manifestBody.trim().slice(0, 300) || '<empty response>'}`,
  );
  console.error(
    '  ..    publish the update with: npx eas-cli@latest update --branch main --environment preview --message "Exercise 28"',
  );
}

// ------------------------------------- 4. the backend of the app is available

console.log('\nRate Repository API');

const apiResponse = await fetch(`${RATE_REPOSITORY_API}/graphql`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ query: '{ repositories(first: 1) { totalCount } }' }),
});
const apiBody = await apiResponse.text();

check(
  apiResponse.status === 200 && apiBody.includes('totalCount'),
  `the pre-deployed Rate Repository API responds (HTTP ${apiResponse.status})`,
);

const failed = checks.filter(({ passed }) => !passed);

if (failed.length > 0) {
  console.error(`\n${failed.length} of ${checks.length} checks failed`);
  // Set the exit code instead of calling process.exit so that the process can
  // shut down gracefully (a forced exit while the HTTP connections are being
  // torn down aborts Node on Windows).
  process.exitCode = 1;
} else {
  console.log(`\nAll ${checks.length} checks passed`);
}
