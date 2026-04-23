# FacePay mobile — investor demo script (~5–7 min)

Use this for **live demos**; if the network or device misbehaves, use a **screen recording** of a successful run as backup (see end).

## Before you start

1. **Backend** running and reachable from the phone (not `localhost` on device — use PC **LAN IP** in `EXPO_PUBLIC_API_BASE_URL`).
2. **Two test accounts** (or one + merchant QR): sender with balance, recipient you can pay.
3. **Phone**: charged, **Do Not Disturb** off for biometrics if needed.
4. **Optional:** `EXPO_PUBLIC_SENTRY_DSN` set in a **preview/production** build so crashes are captured (Phase 5).

---

## Script (happy path)

| Step | What you say / do | Screen |
|------|---------------------|--------|
| 1 | “This is FacePay mobile — same API as our web app.” | Bootstrap → **Login** or tabs if already signed in |
| 2 | Log in with the **demo sender** account. | **Main tabs** — Home |
| 3 | “Home pulls **wallet balance** and **recent transactions** from the API.” Pull to refresh once. | Home |
| 4 | Open **History** — “Full ledger with filters.” | History tab |
| 5 | Open **Receive** → **My QR** — “This QR encodes my receive payload; another user scans it.” | Receive → My QR |
| 6 | (Optional) **Scan** — scan the other user’s QR from a second device or printout — “Scan resolves the recipient server-side.” | Receive → Scan |
| 7 | Home → **Send money** — search recipient → amount → **Review** → **Verify** with **Face ID / fingerprint** — “Biometric gates the transfer, not the face template alone.” | Root stack send flow |
| 8 | Show **Success** receipt line / reference. | Success |
| 9 | **Profile** — security summary, **Face template** link — “Registration uses the camera; transfers still use device biometrics today.” | Profile |
| 10 | **Log out** — “Session and cached feature state clear.” | Login |

---

## If something breaks (live)

1. Stay calm: “We’re on a dev API / Wi‑Fi — I’ll show the same flow from a **recording**.”
2. Open your **backup screen recording** (pre-made on stable Wi‑Fi).
3. Optionally trigger a **Sentry test** only in internal builds: temporary button or dev menu — remove before store.

---

## Recording backup (5 min prep)

1. Reset app state (log out) or use a fresh install.
2. Record screen (iOS: Control Center → Screen Recording; Android: built-in recorder).
3. Run the same steps 1–10 once without narration; keep file **< 90 MB** if you need to email it.

---

## Builds (EAS)

Internal / pilot installs: from `mobile/`, after `eas login` and `eas init` (links project):

```bash
npx eas-cli build --profile preview --platform android
npx eas-cli build --profile preview --platform ios
```

See **`mobile/README.md`** Phase 5 for **Sentry** env vars on EAS.
