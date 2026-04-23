# Phase 4 — workstreams & GitHub issue templates

Locked product/engineering decisions are in [`mobile-plan.md`](./mobile-plan.md) §9 Phase 4 **“Decisions (locked)”**.  
Use the blocks below to create **three GitHub issues** (one per workstream). Labels are suggestions.

---

## Issue 1 — QR: stay on expo-camera; gate vision-camera on evidence

**Title:** `[Phase 4][QR] Defer vision-camera; define scan-quality exit criteria`

**Labels (suggested):** `mobile`, `phase-4`, `qr`, `spike`

**Body:**

### Context

Industry stack for high-volume QR in native apps often uses **Google ML Kit** (Android) or **commercial SDKs** (Scandit, Scanbot) for harsh conditions. This app uses **Expo `CameraView`**, which can use **platform-backed** scanning on supported OS builds.

**Locked decision:** keep **`expo-camera`** until dogfood proves it insufficient.

### Acceptance criteria

- [x] Document **exit criteria** for re-evaluating — see **“QR scan — exit criteria”** below (locked for this repo).
- [ ] If criteria are met: spike **`react-native-vision-camera`** (or document why ML Kit direct integration / commercial SDK was chosen instead).
- [ ] If criteria are not met: close with **“no change”** and link to last test date.

### QR scan — exit criteria (locked)

Re-open the **vision-camera / commercial SDK** decision only if **any** of the following is true after structured dogfood (log counts in a spreadsheet or issue):

1. **Failure rate:** **≥ 15%** of scan attempts fail in **normal** lighting with a **valid** FacePay QR (same device/OS build), over a sample of **≥ 20** attempts across **≥ 3** sessions; **or**
2. **Latency / UX:** median time-to-success **> 8 s** repeatedly; **or**
3. **Pilot:** an external pilot **explicitly** requires enterprise scanning (damaged codes, extreme angles).

Until then, **`expo-camera`** remains the default (see `mobile-plan.md` Phase 4 decisions table).

### Out of scope (for this issue)

- Purchasing commercial SDK licenses.
- Replacing My QR generation (already API-driven).

---

## Issue 2 — Face: quality gate → then server or vendor embedding

**Title:** `[Phase 4][Face] Enrollment quality gate; plan server/vendor embedding`

**Labels (suggested):** `mobile`, `phase-4`, `face`, `backend`, `spike`

**Body:**

### Context

Regulated apps typically add **liveness**, **image quality checks**, and **server or vendor** processing—not a single hash-like vector from JPEG bytes.

**Locked decision:** next increment is **presence + quality gate** before upload; **real** matching requires **backend or vendor**—not mobile-only.

### Acceptance criteria

- [ ] **Mobile:** Before calling `PUT /api/v1/me/face-template`, enforce **single face, frontal, minimum size / sharpness** (spike options: **ML Kit face detection** via dev client / config plugin, or lightweight heuristics if ML Kit is deferred).
- [ ] **Product copy:** UI strings state limits of current template (no liveness claim) until vendor/server path lands.
- [ ] **Backend / product:** Open or link a **companion issue** for one of: (a) **server-side embedding** from enrollment image, (b) **vendor SDK** (Onfido-class), or (c) explicit **defer** with reason.
- [ ] Remove or narrow use of **proxy-only** path once (a) or (b) exists, or keep proxy **only** behind a dev flag.

### Out of scope

- Pretending the current proxy is **PAD / liveness** compliant.

---

## Issue 3 — Auth: refresh tokens + rotation (backend-led)

**Title:** `[Phase 4][Auth] Refresh token API + mobile SecureStore wiring`

**Labels (suggested):** `backend`, `mobile`, `phase-4`, `auth`, `security`

**Body:**

### Context

Industry norm for consumer/financial apps: **short-lived access** + **rotating refresh** in **Keychain/Keystore** (here: **Expo SecureStore**). OAuth BCPs warn against long-lived bearer-only mobile sessions without rotation.

**Locked decision:** **no** refresh logic on mobile until **`backend`** exposes refresh issuance, rotation, and logout revocation.

### Acceptance criteria (backend)

- [ ] Issue **opaque refresh token** on login/signup; **rotate** on each refresh; **detect reuse** if feasible.
- [ ] **Revoke** refresh family on logout and optionally on password change.
- [ ] **Access JWT** short TTL (e.g. 5–15 min); document claims (`exp`, `sub`).

### Acceptance criteria (mobile) — after API exists

- [ ] Store **access** + **refresh** in SecureStore (separate keys); attach access to `Authorization`.
- [ ] On **401**: attempt **one** refresh; on failure run existing **session cleanup** + login.
- [ ] **Logout:** call server revoke + delete both tokens locally.

### References

- Curity: OAuth for mobile apps best practices.
- IETF: OAuth 2.0 Security Best Current Practice (refresh rotation, public clients).

---

## Quick checklist (maintainer)

| # | Workstream | Owner | Status |
|---|------------|-------|--------|
| 1 | QR exit criteria + optional vision-camera spike | TBD | **Criteria documented** — spike only if metrics hit thresholds |
| 2 | Face quality gate + backend/vendor plan | TBD | Not started |
| 3 | Refresh API + mobile wiring | TBD | Blocked on backend |

Update this table as issues close.
