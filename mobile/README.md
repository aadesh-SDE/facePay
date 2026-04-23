# FacePay mobile (Expo + React Native)

**Phase 1:** MVVM-aligned `src/` layout, **Redux + redux-persist**, **React Navigation** (guest vs authed), **`GET /health`** via `axios`.

**Phase 2:** **Design tokens** in `src/shared/theme/` (colors / spacing / radii / shadows / typography aligned with `frontend/tailwind.config.ts`), **Manrope** via `@expo-google-fonts/manrope` + `expo-font`, **`ThemeProvider`**, primitives **`Screen`**, **`AppText`**, **`AppButton`**, **`AppTextField`**, **`Card`** — screens use these instead of ad hoc `StyleSheet` colors.

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

## Dev flow (Phases 1–2)

1. Open app → **Login** (themed).
2. Tap **Dev: continue as signed in** → **Home** runs `GET /health` inside a **`Card`**.
3. **Log out** clears auth (persisted slice).

Next: real auth API, tabs / inner stacks, send / face / QR per `docs/mobile-plan.md`.
