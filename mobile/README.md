# FacePay mobile (Expo + React Native)

Phase 1 skeleton: **MVVM-aligned** `src/` layout (`app/`, `pages/`, `features/`, `shared/`), **Redux + redux-persist**, **React Navigation** with guest vs authed stacks, **`GET /health`** smoke call via `axios`.

## Prereqs

- Node.js (LTS; match [Expo SDK 54](https://docs.expo.dev/) docs)
- For Android: Android Studio / emulator or USB device
- For iOS device/simulator: macOS + Xcode, or use **Expo Go** on a physical iPhone

## Run

```bash
cd mobile
npm install
npm run start
```

Start the API from repo root (`backend/`, default port **3000**) or set a custom base URL (below).

## API base URL

- **Default:** `http://127.0.0.1:3000` (from `app.config.ts` → `extra.apiBaseUrl`)
- **Override:** set `EXPO_PUBLIC_API_BASE_URL` when starting Expo, e.g.  
  `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:3000 npm run start` (Android emulator → host)
- **Physical device:** use your PC’s LAN IP, e.g. `http://192.168.1.42:3000`, and ensure the API listens on `0.0.0.0` (already true for `backend`).

Android **HTTP** dev traffic is allowed via `usesCleartextTraffic` in `app.json`.

## Phase 1 dev flow

1. Open app → **Login** skeleton.
2. Tap **Dev: continue as signed in** → **Home** runs `GET /health`.
3. **Log out** clears auth (persisted slice).

Next phases: real auth API, tabs / inner stacks, feature MVVM for send / face / QR per `docs/mobile-plan.md`.
