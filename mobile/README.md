# FacePay mobile (Expo + React Native)

**Phase 1:** MVVM-aligned `src/` layout, **Redux + redux-persist**, **React Navigation** (guest vs authed), **`GET /health`** via `axios`.

**Phase 2:** **Design tokens** in `src/shared/theme/` (colors / spacing / radii / shadows / typography aligned with `frontend/tailwind.config.ts`), **Manrope** via `@expo-google-fonts/manrope` + `expo-font`, **`ThemeProvider`**, primitives **`Screen`**, **`AppText`**, **`AppButton`**, **`AppTextField`**, **`Card`** — screens use these instead of ad hoc `StyleSheet` colors.

**Phase 3 (complete):** Same auth/bootstrap as before, plus **bottom tabs** (**Home**, **History**, **Receive** → My QR + Scan, **Profile**), **Profile** (`/me`, `/me/security-summary`), **History** (full transaction list + filter/search), **Receive** (QR from API + scan), **Send** (search → amount → review → **biometric verify** → `POST /api/v1/transfers`), **Face template** (camera-derived vector + `/me/face-template`; Phase 4 refines this). **401 / logout** clear feature state via **`src/app/sessionCleanup.ts`**. See **`docs/mobile-plan.md`** §9 Phase 3.

**Phase 4 (started):** **QR** scan UX (torch, haptics, cooldown, focus reset); **face registration** via **front-camera photo** → capture-derived **128-D proxy** → same face-template API; **iOS** privacy strings for camera + Face ID. **Locked follow-up decisions** + **GitHub issue templates:** **`docs/mobile-plan.md`** §9 Phase 4 (*Decisions (locked)*), **`docs/mobile-phase4-tracker.md`**.

**Phase 5 (scaffold complete):** **Demo script** → [`../docs/mobile-demo-script.md`](../docs/mobile-demo-script.md). **EAS** → `eas.json` (`development`, **`preview`** internal, **`production`**). **Sentry** wired; enable with **`EXPO_PUBLIC_SENTRY_DSN`**. **You run when needed:** `eas login`, `eas init` in `mobile/`, `npx eas-cli build --profile preview --platform android`, EAS secrets for maps — see **`docs/mobile-plan.md`** §9 Phase 5.

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
2. **Bootstrap** shows a brief spinner, then **Login** or **main tabs** if a token exists in SecureStore.
3. **Sign in** with real credentials → **Home** tab loads balance + recent txs; **pull to refresh** refetches.
4. **Log out** (Profile tab) calls **`POST /api/v1/auth/logout`**, clears SecureStore, and runs **`resetSessionClientState`** (home, wallet, profile, history, receive, send, face).

**Plugins:** `app.json` includes **`expo-camera`** permission copy for QR scan.
