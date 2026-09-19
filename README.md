# Rate Repository App

A React Native application for browsing, reviewing and rating GitHub
repositories. This repository contains the final version of the application
developed in the [Full Stack Open](https://fullstackopen.com/) part 10 course.

## Published application (Exercise 28)

The final version of the application is published with
[EAS Update](https://docs.expo.dev/eas-update/introduction/). Scan the QR code
below with the [Expo Go](https://expo.dev/go) application to open the published
application on a real device:

![QR code of the published application](qr-code.png)

The QR code is an Expo Go deep link of the `main` branch of the EAS project:

`exp://u.expo.dev/b4c2ae0e-c003-4858-9b91-36462fd79c15?channel-name=main&runtime-version=1.0.0`

The published application uses the pre-deployed Rate Repository API as its
backend:

`https://rate-repository-api-2.ext.ocp-prod-0.k8s.it.helsinki.fi/`

## Development

### Requirements

- Node.js
- A locally running [Rate Repository API](https://github.com/fullstack-hy2020/rate-repository-api)
  (see `rate-repository-app/.env` for the `EXPO_PUBLIC_APOLLO_URI` value)

### Running the application

```sh
cd rate-repository-app
npm install
npx expo start
```

### Running the tests

```sh
cd rate-repository-app
npm test -- --ci
```

### Linting

```sh
cd rate-repository-app
npm run lint
```

### Web export

```sh
cd rate-repository-app
npx expo export --platform web
```

## Publishing a new update (EAS Update)

The `preview` environment of the EAS project defines the production backend:

```sh
cd rate-repository-app
npx eas-cli@latest env:list --environment preview
```

Publishing an update to the `main` branch:

```sh
cd rate-repository-app
npx eas-cli@latest update --branch main --environment preview --message "Exercise 28"
```

Regenerating the QR code image (requires `qrcode`, `jsqr` and `pngjs`):

```sh
cd rate-repository-app
npm install --no-save --no-audit --no-fund qrcode jsqr pngjs
node scripts/generate-qr-code.mjs
```

Verifying the Exercise 28 deliverables:

```sh
cd rate-repository-app
npm install --no-save --no-audit --no-fund jsqr pngjs
node scripts/verify-eas-update.mjs
```
