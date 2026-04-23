# FacePay mobile (Expo + React Native)

**Phase 1:** MVVM-aligned `src/` layout, **Redux + redux-persist**, **React Navigation** (guest vs authed), **`GET /health`** via `axios`.

**Phase 2:** **Design tokens** in `src/shared/theme/` (colors / spacing / radii / shadows / typography aligned with `frontend/tailwind.config.ts`), **Manrope** via `@expo-google-fonts/manrope` + `expo-font`, **`ThemeProvider`**, primitives **`Screen`**, **`AppText`**, **`AppButton`**, **`AppTextField`**, **`Card`** — screens use these instead of ad hoc `StyleSheet` colors.

**Phase 3 (in progress):** **Login / Signup** call the real backend; **JWT** is stored in **SecureStore** (`fp_token`); **bootstrap** restores the user with **`GET /api/v1/me`**. **Home** shows balance + recent transactions (same APIs as web). Next in this phase: Profile, History, Receive, Send, Face (per `docs/mobile-plan.md`).

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

## Dev flow

1. Start **backend** on port **3000** (or set `EXPO_PUBLIC_API_BASE_URL`).
2. **Bootstrap** shows a brief spinner, then **Login** or **Home** if a token exists in SecureStore.
3. **Sign in** with real credentials → **Home** loads balance + recent txs; **pull to refresh** refetches.
4. **Log out** calls **`POST /api/v1/auth/logout`**, clears SecureStore, and resets cached home/wallet state.

Next: Profile, History, Receive, Send, Face per `docs/mobile-plan.md`.
