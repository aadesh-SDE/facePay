# FacePay Android App Plan (Jetpack Compose + Kotlin)

This document replaces the old React Native mobile direction and defines a native Android-first plan for FacePay.  
Goal: ship a solid Android app now, while keeping backend contracts and product flows ready for iOS later.

---

## 1. Current state (what we already have)

| Area | Current status | Notes |
|------|----------------|-------|
| **Backend API** | Available in `backend/` | Can be reused directly by Android as the source of truth. |
| **Web frontend flows** | Available in `frontend/` | Useful as functional reference for feature parity and edge cases. |
| **Old mobile app** | Removed | React Native code and docs were intentionally deleted. |
| **Product concept** | Stable | FacePay core flow remains auth -> wallet -> send/receive -> history -> profile. |

---

## 2. Goals and non-goals

### 2.1 Goals

- Build a production-quality **native Android app** using **Kotlin + Jetpack Compose**.
- Achieve **functional parity** with existing FacePay web experience where it matters.
- Use the same backend APIs and keep business rules server-driven.
- Set up maintainable architecture for fast iteration and easy onboarding.
- Keep iOS path clean by stabilizing contracts, UX rules, and design tokens.

### 2.2 Non-goals (Phase 1-2)

- No iOS implementation yet.
- No premature multi-platform abstraction layer.
- No over-engineering around offline-first unless product requires it.
- No Docker-based Android app development workflow.

### 2.3 Docker policy (locked)

- **Android app (`Jetpack Compose + Kotlin`)**: run natively on host machine (Android Studio, Gradle, emulator/real device).
- **Backend/dependencies**: Docker is optional only for backend services if needed.
- **Decision:** skip Docker for mobile app development in this project.

---

## 3. Product scope (Android MVP)

### 3.1 Core user journeys

1. Sign up / log in
2. Home dashboard (balance + quick actions + recent transactions)
3. Send payment (recipient selection, amount, review, confirm)
4. Receive payment (QR generation and scan flow, if backend supports payload format)
5. Transaction history
6. Profile + logout
7. Face verification-related UX (aligned with backend capability and Android biometrics policy)

### 3.2 Out of scope initially

- Advanced analytics dashboards
- Complex background sync
- Tablet-specific layouts

### 3.3 Web UI parity (source of truth)

Android MVP screens must match the **existing web app** flows and visual language (not a second brand).  
Authoritative references in this repo:

| Android surface | Web route | Web implementation (examples) |
|-------------------|-----------|--------------------------------|
| Login | `/login` | `frontend/src/pages/login/LoginPage.tsx` |
| Sign up | `/signup` | `frontend/src/pages/signup/SignupPage.tsx` |
| Home (tabs shell) | `/` | `frontend/src/pages/home/HomePage.tsx` + `frontend/src/shared/components/layout/BottomNav.tsx` |
| Register face | `/register-face` | `frontend/src/pages/registerFace/RegisterFacePage.tsx` |
| Send: recipient | `/send` | `frontend/src/pages/selectRecipient/SelectRecipientPage.tsx` |
| Send: amount | `/send/amount` | `frontend/src/pages/enterAmount/EnterAmountPage.tsx` |
| Send: review | `/send/review` | `frontend/src/pages/reviewPayment/ReviewPaymentPage.tsx` |
| Send: verify | `/send/verify` | `frontend/src/pages/faceVerification/FaceVerificationPage.tsx` |
| Send: verify failed | `/send/verify/failed` | `frontend/src/pages/verificationFailed/VerificationFailedPage.tsx` |
| Send: success | `/send/success` | `frontend/src/pages/successReceipt/SuccessReceiptPage.tsx` |
| History | `/history` | `frontend/src/pages/history/HistoryPage.tsx` |
| Receive: My QR | `/receive` | `frontend/src/pages/myQrCode/MyQRCodePage.tsx` |
| Receive: Scan | `/receive/scan` | `frontend/src/pages/scanQr/ScanQRPage.tsx` |
| Profile | `/profile` | `frontend/src/pages/profile/ProfilePage.tsx` |

Router source: [`frontend/src/app/router.tsx`](../frontend/src/app/router.tsx).

**Static design references (screenshots / Stitch):** Use repo-root [`designs/`](../designs/) as the primary **pixel-level** reference. It contains **Google Stitch** HTML exports per screen (for example [`designs/stitch_new/stitch/login/code.html`](../designs/stitch_new/stitch/login/code.html), [`designs/stitch_new/stitch/home_dashboard/code.html`](../designs/stitch_new/stitch/home_dashboard/code.html)). Open `code.html` in a browser for full-page visuals. Where both [`designs/stitch/`](../designs/stitch/) and [`designs/stitch_new/stitch/`](../designs/stitch_new/stitch/) exist for the same flow, default to **`stitch_new`** unless you explicitly choose the older tree. Any **raster screenshots** you export should also live under `designs/` (e.g. a `designs/screenshots/` folder) so QA stays in one place.

**Design tokens (colors, radii, shadows, fonts):** [`frontend/tailwind.config.ts`](../frontend/tailwind.config.ts) — port these into Compose `Color`, `Typography`, and shape tokens (tokens should match Stitch + implemented web).  
**Icons:** Material Symbols (align with web). **Fonts:** Manrope + Poppins (same as web).

**Parity bar:** match **`designs/`** references and the **live web app** **within normal mobile constraints** (safe areas, keyboard, dynamic type, varied aspect ratios). Pixel-identical layout on every device size is not a realistic goal; **token + composition parity** is.

---

## 4. Tech stack decisions

### 4.1 Language and UI

| Layer | Choice | Why |
|------|--------|-----|
| **Language** | **Kotlin** | Modern Android standard, strong tooling and coroutine support. |
| **UI toolkit** | **Jetpack Compose (Material 3)** | Faster UI iteration, cleaner state-driven UI, modern Android best practice. |
| **Navigation** | **Navigation Compose** | Official route handling for Compose apps. |

### 4.2 Architecture and state

| Layer | Choice | Why |
|------|--------|-----|
| **Pattern** | **MVVM + feature modules (by package)** | Clear separation and scalable code organization. |
| **State management** | `StateFlow` / `MutableStateFlow` | Predictable reactive UI updates and coroutine-native. |
| **Dependency injection** | **Hilt** | Official Android DI, good testability and lifecycle integration. |

### 4.3 Network and persistence

| Layer | Choice | Why |
|------|--------|-----|
| **HTTP** | **Retrofit + OkHttp + Kotlinx Serialization** | Reliable API integration and maintainable DTO mapping. |
| **Local storage (non-token)** | **DataStore** (preferences) | Modern replacement for SharedPreferences when app settings or flags are introduced. |
| **Session token (JWT)** | **EncryptedSharedPreferences** (AndroidX Security Crypto) | Satisfies **§7.5** (encrypted at rest). Do not store the access token in plain SharedPreferences or unencrypted DataStore. |
| **Database** | **Room** (only if needed) | Structured local caching for history/offline later. |

**Implementation note:** The shipped Android app (`android-app/`) persists the JWT only via **EncryptedSharedPreferences** (`SecureTokenStore`). DataStore is not required for Phase 1 auth until non-token preferences exist; Room is deferred until list caching needs it (e.g. history).

### 4.4 Tooling and quality

| Area | Choice |
|------|--------|
| **Build** | Gradle Kotlin DSL |
| **Min SDK target** | **24** |
| **Static analysis** | ktlint + detekt |
| **Testing** | JUnit5, Turbine (Flow), Compose UI tests, MockWebServer |
| **CI (later)** | Build + unit tests + lint checks |

**Current baseline (`android-app/`):** JUnit 4, MockK, and `kotlinx-coroutines-test` for JVM unit tests (e.g. session bootstrap). Evolve toward the table targets (JUnit 5, Turbine, MockWebServer, Compose UI tests) during **Phase 4** hardening.

### 4.5 Frozen implementation decisions (authority lock)

These decisions are locked for implementation kickoff.

#### A) Exact dependency choices

- **Serialization:** Kotlinx Serialization (no Moshi).
- **Image loading:** Coil 3 (`coil-compose` + `coil-network-okhttp`).
- **QR scanning:** ML Kit Barcode Scanning via CameraX (`camera-camera2`, `camera-lifecycle`, `camera-view`, `mlkit-barcode-scanning`).
- **Version policy:** use current stable releases at setup time (via Gradle Version Catalog + Compose BOM stable track where applicable).

**Gradle classpath (staggered):** The app does **not** have to declare Coil, CameraX, or ML Kit until a feature needs them (e.g. Coil for avatars or cached images; CameraX + ML Kit for receive/scan in **Phase 3**). Early phases keep a smaller native dependency footprint; when wiring those flows, add the coordinates above to `gradle/libs.versions.toml` and `app/build.gradle.kts`, restore `CAMERA` / optional `uses-feature` in the manifest, and align with **`android-app/README.md`**.

#### B) App identity and SDK

- **`applicationId`:** `com.facepay.android`
- **`minSdk`:** `24`
- **`targetSdk`:** latest Play-compliant stable at implementation time (must satisfy Play requirement).

#### C) Android environment/flavor API base URL rules

- **Primary backend origin (all default app builds):** `https://facepay-inrz.onrender.com`
- **Flavor/buildType policy:**
  - `debug`: defaults to deployed backend, optional local override via `local.properties`/env only when explicitly enabled.
  - `release`: deployed backend only.
- **Path rule:** keep endpoint paths as `/api/v1/*` across features.

#### D) Release signing and distribution baseline

- Use **AAB** for release artifacts.
- Enroll in **Play App Signing** (upload key + Google-managed app signing key).
- Distribution ladder baseline:
  1. internal testing track (must pass)
  2. closed testing (if needed for wider validation)
  3. production promotion of the same verified bundle
- Internal track is the mandatory first gate for every release candidate.

---

## 5. Proposed architecture

### 5.1 High-level layers

1. **presentation/**  
   Compose screens, UI components, navigation, ViewModels.
2. **domain/**  
   Use-cases, business rules local to app, pure models where useful.
3. **data/**  
   API clients, DTO mappers, repository implementations, local persistence.
4. **core/**  
   Design system, networking setup, auth/session, utilities, constants.

### 5.2 Feature-first package structure (initial)

```
android-app/
  app/
    src/main/java/com/facepay/
      core/
        designsystem/
        network/
        session/
        util/
      feature/
        auth/
          data/
          domain/
          presentation/
        home/
          data/
          domain/
          presentation/
        send/
          data/
          domain/
          presentation/
        receive/
          data/
          domain/
          presentation/
        history/
          data/
          domain/
          presentation/
        profile/
          data/
          domain/
          presentation/
      navigation/
      MainActivity.kt
```

**Repo note:** The live tree under `com/facepay/android/` currently uses **`feature/main/`** for the Phase 1 authenticated home shell; functionally this matches **`feature/home/`** above. Rename the package to `home` when the dashboard scope grows (optional cleanup, not a contract blocker).

### 5.4 Final file structure (implementation blueprint)

This is the final structure to follow while building the Android app.

```
android-app/
  settings.gradle.kts
  build.gradle.kts
  gradle/libs.versions.toml

  app/
    build.gradle.kts
    proguard-rules.pro
    src/main/
      AndroidManifest.xml
      java/com/facepay/android/
        FacePayApplication.kt
        MainActivity.kt

        core/
          common/
            AppDispatchers.kt
            AppResult.kt
            AppError.kt
          network/
            ApiConstants.kt
            ApiServiceFactory.kt
            AuthInterceptor.kt
            NetworkModule.kt
          session/
            SessionManager.kt
            SessionStorage.kt
            SessionModule.kt
          security/
            BiometricAuthenticator.kt
          navigation/
            Destinations.kt
            RootNavHost.kt
            AuthGraph.kt
            MainGraph.kt
            SendGraph.kt
          designsystem/
            theme/
              Color.kt
              Type.kt
              Shape.kt
              Elevation.kt
              Spacing.kt
              Motion.kt
              FacePayTheme.kt
            components/
              scaffold/
                FpAppScaffold.kt
              appbar/
                FpTopBar.kt
              nav/
                FpBottomNavBar.kt
              button/
                FpButton.kt
              input/
                FpTextField.kt
                FpAmountField.kt
              card/
                FpCard.kt
              state/
                FpLoadingState.kt
                FpEmptyState.kt
                FpErrorState.kt
              feedback/
                FpSnackbarHost.kt
                FpConfirmDialog.kt

        feature/
          auth/
            data/
              remote/
                dto/
                  LoginRequestDto.kt
                  AuthResponseDto.kt
                AuthApi.kt
              mapper/
                AuthMapper.kt
              repository/
                AuthRepositoryImpl.kt
            domain/
              model/
                AuthUser.kt
              repository/
                AuthRepository.kt
              usecase/
                LoginUseCase.kt
                SignupUseCase.kt
                LogoutUseCase.kt
            presentation/
              model/
                AuthUiState.kt
                AuthUiEvent.kt
                AuthUiEffect.kt
              viewmodel/
                AuthViewModel.kt
              screen/
                LoginScreen.kt
                SignupScreen.kt

          home/
            data/
              remote/dto/
                HomeSummaryDto.kt
              HomeApi.kt
              mapper/HomeMapper.kt
              repository/HomeRepositoryImpl.kt
            domain/
              model/HomeSummary.kt
              repository/HomeRepository.kt
              usecase/GetHomeSummaryUseCase.kt
            presentation/
              model/HomeUiState.kt
              viewmodel/HomeViewModel.kt
              screen/HomeScreen.kt
              component/
                BalanceCard.kt
                QuickActionRow.kt

          send/
            data/
              remote/dto/
                RecipientDto.kt
                TransferRequestDto.kt
                TransferResponseDto.kt
              SendApi.kt
              mapper/SendMapper.kt
              repository/SendRepositoryImpl.kt
            domain/
              model/
                Recipient.kt
                TransferResult.kt
              repository/SendRepository.kt
              usecase/
                SearchRecipientsUseCase.kt
                SubmitTransferUseCase.kt
            presentation/
              model/
                SendUiState.kt
                SendUiEvent.kt
                SendUiEffect.kt
              viewmodel/SendViewModel.kt
              screen/
                SelectRecipientScreen.kt
                EnterAmountScreen.kt
                ReviewPaymentScreen.kt
                VerifyPaymentScreen.kt
                SuccessReceiptScreen.kt
                VerificationFailedScreen.kt
              component/
                RecipientListItem.kt
                PaymentSummaryCard.kt

          history/
            data/
              remote/dto/TransactionDto.kt
              HistoryApi.kt
              mapper/HistoryMapper.kt
              repository/HistoryRepositoryImpl.kt
            domain/
              model/TransactionItem.kt
              repository/HistoryRepository.kt
              usecase/GetTransactionsUseCase.kt
            presentation/
              model/HistoryUiState.kt
              viewmodel/HistoryViewModel.kt
              screen/HistoryScreen.kt
              component/TransactionListItem.kt

          receive/
            data/
              remote/dto/ReceiveQrDto.kt
              ReceiveApi.kt
              mapper/ReceiveMapper.kt
              repository/ReceiveRepositoryImpl.kt
            domain/
              model/ReceiveQrPayload.kt
              repository/ReceiveRepository.kt
              usecase/GetReceiveQrUseCase.kt
            presentation/
              model/ReceiveUiState.kt
              viewmodel/ReceiveViewModel.kt
              screen/
                MyQrScreen.kt
                ScanQrScreen.kt
              component/
                QrCodeCard.kt
                QrScannerOverlay.kt

          faceauth/
            data/
              remote/dto/FaceTemplateDto.kt
              FaceAuthApi.kt
              mapper/FaceAuthMapper.kt
              repository/FaceAuthRepositoryImpl.kt
            domain/
              model/FaceTemplate.kt
              repository/FaceAuthRepository.kt
              usecase/
                SaveFaceTemplateUseCase.kt
                GetFaceTemplateUseCase.kt
                DeleteFaceTemplateUseCase.kt
            presentation/
              model/FaceAuthUiState.kt
              viewmodel/FaceAuthViewModel.kt
              screen/RegisterFaceScreen.kt
              component/FaceCaptureFrame.kt

          profile/
            data/
              remote/dto/
                ProfileDto.kt
                SecuritySummaryDto.kt
              ProfileApi.kt
              mapper/ProfileMapper.kt
              repository/ProfileRepositoryImpl.kt
            domain/
              model/
                UserProfile.kt
                SecuritySummary.kt
              repository/ProfileRepository.kt
              usecase/
                GetProfileUseCase.kt
                GetSecuritySummaryUseCase.kt
            presentation/
              model/ProfileUiState.kt
              viewmodel/ProfileViewModel.kt
              screen/ProfileScreen.kt

      res/
        values/
          strings.xml
          themes.xml
        font/
          manrope_*.ttf
          poppins_*.ttf

    src/test/
      ... unit tests by feature/core

    src/androidTest/
      ... Compose UI and integration tests
```

Structure rules:

- Follow feature-first layering (`presentation/domain/data`) for each feature.
- Keep shared, non-feature code in `core/*`.
- Do not place API DTOs in presentation/domain packages.
- Keep route definitions centralized under `core/navigation`.

### 5.3 Navigation graph and auth-gated routing (Q3 locked)

Navigation is implemented with a **single root NavHost** and nested graphs, aligned to official Android Navigation Compose guidance and current backend auth behavior.

#### A) Graph structure

1. `RootGraph`
   - Chooses start destination based on session state (`AuthGraph` vs `MainGraph`).
2. `AuthGraph` (guest only)
   - `login`
   - `signup`
3. `MainGraph` (authenticated only)
   - Tab roots: `home`, `history`, `receive`, `profile`
   - Nested flows:
     - `sendGraph`: `send/selectRecipient` -> `send/amount` -> `send/review` -> `send/verify` -> `send/success` / `send/failed`
     - `faceGraph`: `registerFace`
     - receive sub-route: `receive/scan`

#### B) Tab switching contract

- Bottom tabs: **Home, History, Receive, Profile**.
- On tab click, navigate with:
  - `launchSingleTop = true`
  - `restoreState = true`
  - `popUpTo(mainGraphStart) { saveState = true }`
- Result: each tab keeps its own back stack/state and avoids duplicate destinations.

#### C) Auth-gating rules

Based on backend reality in **§7.3** (stateless Bearer JWT, no refresh flow yet):

1. **Guest-only routes:** `login`, `signup`
2. **Protected routes:** all tab roots + `send/*` + `registerFace` + `receive/scan`
3. If user is unauthenticated and requests protected route -> route to `login`
4. If user is authenticated and opens guest route -> route to `home`
5. On `401` from protected APIs:
   - clear local session/token
   - clear feature state where needed
   - reset nav stack to `login`
6. On logout:
   - call backend logout endpoint (best effort)
   - always clear local token/session
   - reset nav stack to `login`

#### D) Back behavior rules

- Inside nested flows (`send/*`, `receive/scan`, `registerFace`): back pops within that flow.
- At non-home tab root: back switches to `home` tab first.
- At `home` root: back exits app (default system behavior).

---

## 6. Design system and UX direction

### 6.1 Design principles

- Keep visual language aligned with FacePay brand.
- Use Material 3 foundation but customize theme tokens.
- Prioritize clarity in transaction-critical flows (send/review/confirm/success).
- Build reusable components (buttons, input fields, amount cards, transaction tiles).

### 6.2 Design artifacts to define before implementation

- Color tokens (primary, semantic success/error/warning, surfaces)
- Typography scale
- Spacing/radius/shadow tokens
- Common component variants and states
- Loading, empty, and error states pattern

### 6.3 UX quality bar

- Fast startup and responsive interactions
- Clear validation and failure messaging
- Safe back navigation in payment flows
- Accessibility baseline (font scaling, content descriptions, contrast)

### 6.4 Locked token set and reusable components (Q2)

#### A) Design tokens for Compose (v1)

Source: [`frontend/tailwind.config.ts`](../frontend/tailwind.config.ts) + [`designs/`](../designs/) references.

1. **Color tokens (port as `ColorScheme` + app extras)**
   - **Brand/primary:** `primary`, `primary-container`, `primary-fixed`, `primary-fixed-dim`, `on-primary`, `on-primary-container`, `on-primary-fixed`, `on-primary-fixed-variant`
   - **Secondary:** `secondary`, `secondary-container`, `secondary-fixed`, `secondary-fixed-dim`, `on-secondary`, `on-secondary-container`, `on-secondary-fixed`, `on-secondary-fixed-variant`
   - **Tertiary/accent:** `tertiary`, `tertiary-container`, `tertiary-fixed`, `tertiary-fixed-dim`, `on-tertiary`, `on-tertiary-container`, `on-tertiary-fixed`, `on-tertiary-fixed-variant`
   - **Surfaces:** `background`, `surface`, `surface-dim`, `surface-bright`, `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`, `surface-variant`, `surface-tint`, `on-background`, `on-surface`, `on-surface-variant`, `inverse-surface`, `inverse-on-surface`, `inverse-primary`
   - **Status/semantic:** `error`, `error-container`, `on-error`, `on-error-container`
   - **Borders:** `outline`, `outline-variant`
   - **App semantic aliases (added in Compose):** `success`, `warning`, `info` (mapped from current palette where possible; explicit hex additions allowed if missing)

2. **Typography tokens**
   - **Font families:** `Manrope` (default UI), `Poppins` (headline/accent where used in web)
   - **Type scale:** `display`, `headline`, `title`, `body`, `label` in Material 3 style, tuned to web hierarchy
   - **Weights:** regular, medium, semibold, bold only (avoid uncontrolled custom weights)
   - **Rules:** amount/value text style and transaction metadata styles must be fixed tokens, not ad-hoc per screen

3. **Spacing/layout tokens**
   - Base spacing scale: `4, 8, 12, 16, 20, 24, 32, 40` dp
   - Screen paddings: compact (`16`), regular (`20/24`) by breakpoint
   - Vertical rhythm: section gaps and list item spacing from token constants only

4. **Shape/radius tokens**
   - Map from Tailwind: default `4dp`, `lg 16dp`, `xl 24dp`, `2xl 16dp`, `full 999dp`
   - Components must consume shape tokens via theme; no hardcoded corner radii in feature screens

5. **Elevation/shadow tokens**
   - Map web shadows (`whisper`, `whisper-up`, `glow`, `soft`, `elevated`) to Compose elevation levels (`0, 1, 3, 6, 8`)
   - Keep glow usage limited to CTA emphasis only

6. **Motion tokens (minimal v1)**
   - Standard durations: `150ms`, `250ms`, `350ms`
   - Easing: standard Material easing curves
   - Apply to navigation transitions, loading state swaps, and button feedback

#### B) Reusable component inventory for FacePay (v1)

1. **Foundation components**
   - `FpAppScaffold` (safe area, top/bottom bars, snackbar host)
   - `FpTopBar` (title/back/actions variants)
   - `FpBottomNavBar` (Home, History, Receive, Profile)
   - `FpPrimaryButton`, `FpSecondaryButton`, `FpTonalButton`, `FpDangerButton`
   - `FpTextField` (text/email/password/search)
   - `FpAmountField` (currency formatting behavior)
   - `FpCard` (surface + elevation tokenized)

2. **State components**
   - `FpLoadingState`
   - `FpEmptyState`
   - `FpErrorState` (retry callback)
   - `FpInlineError`

3. **Domain components**
   - `BalanceCard`
   - `QuickActionRow`
   - `TransactionListItem`
   - `RecipientListItem`
   - `PaymentSummaryCard`
   - `StatusResultScreen` (success/failure reusable shell)
   - `QrCodeCard`
   - `QrScannerOverlay`
   - `FaceCaptureFrame`
   - `FaceVerificationStatusBadge`

4. **Behavior/UX wrappers**
   - `FpPullToRefreshContainer`
   - `FpModalBottomSheet`
   - `FpConfirmDialog`
   - `FpNetworkBanner`

#### C) File layout for design system package

```
android-app/app/src/main/java/com/facepay/core/designsystem/
  theme/
    Color.kt
    Type.kt
    Shape.kt
    Elevation.kt
    Spacing.kt
    Motion.kt
    FacePayTheme.kt
  components/
    button/
    input/
    card/
    navigation/
    state/
    domain/
```

#### D) Governance rules

- Any new screen must use tokens/components first; no direct hardcoded style values unless unavoidable.
- If a new visual pattern repeats in 2+ places, promote it to `core/designsystem/components`.
- Keep a parity checklist per screen against [`designs/`](../designs/) and web references before marking complete.

---

## 7. Backend contract alignment

### 7.1 Contract-first rules

- Treat backend API as source of truth.
- Define Android DTOs to match server payloads exactly.
- Keep mapping layer explicit (DTO -> domain model).
- Log and handle API errors consistently (user-safe message + debug detail).

### 7.2 Session and security baseline

- Access token handling in secure storage strategy.
- Optional refresh-token flow based on backend support roadmap.
- Biometrics for sensitive actions where product/security requires.
- Never duplicate sensitive server-side business logic in UI.

### 7.3 Backend auth reality check (used for navigation decisions)

Based on backend implementation in:
- [`backend/src/features/auth/auth.router.ts`](../backend/src/features/auth/auth.router.ts)
- [`backend/src/features/auth/auth.service.ts`](../backend/src/features/auth/auth.service.ts)
- [`backend/src/shared/middleware/requireAuth.ts`](../backend/src/shared/middleware/requireAuth.ts)
- [`backend/src/shared/lib/jwt.ts`](../backend/src/shared/lib/jwt.ts)
- [`backend/src/shared/lib/env.ts`](../backend/src/shared/lib/env.ts)

Current behavior:

1. **Auth model:** stateless **Bearer access JWT** only (`Authorization: Bearer <token>`).
2. **Token issuance:** `/api/v1/auth/login` and `/api/v1/auth/signup` return `{ user, token }`.
3. **Logout:** `/api/v1/auth/logout` requires auth, but server does not revoke token yet (commented as future refresh-token invalidation point). Client must drop token and clear local session.
4. **Protected APIs:** use `requireAuth` middleware; invalid/missing/expired token returns `401 UNAUTHORIZED`.
5. **Refresh token:** not implemented in current backend.
6. **Token TTL:** controlled by `JWT_EXPIRES_IN` env (default `7d`).

Android implication (must drive nav/auth gating):

- Session source of truth on app side is "have valid token + user profile context".
- On any `401` from protected endpoints, clear session and route-reset to Login.
- Post-logout must clear token and reset back stack (because server-side logout is effectively client-token discard in this version).

### 7.4 API integration conventions (Q5 locked)

#### A) Networking stack (locked)

- **HTTP client:** Retrofit + OkHttp
- **JSON serialization:** Kotlinx Serialization (single parser across app)
- **Dependency injection:** Hilt for ApiServices, repositories, interceptors, and dispatchers
- **Async model:** Kotlin Coroutines + Flow

#### B) DTO mapping contract (locked)

Every networked feature must keep strict model boundaries:

1. `DTO` (remote transport shape) -> located in `feature/*/data/remote/dto`
2. `Domain` model (business shape) -> located in `feature/*/domain/model`
3. `UI` model/state (render shape) -> located in `feature/*/presentation`

Rules:

- UI must never depend directly on DTO classes.
- Mapping must be explicit in data layer mappers (`toDomain()`, `toDto()` where needed).
- Repository output to ViewModel is domain-level data (or app-level result wrappers), not raw Retrofit responses.

#### C) Unified error model (locked)

Repositories normalize all failures into one app-level error contract (example names):

- `Unauthorized` (`401`)
- `Forbidden` (`403`)
- `NotFound` (`404`)
- `Validation` (`400/422`)
- `Server` (`5xx`)
- `Network` (timeouts, connectivity, DNS)
- `Unknown`

Repository calls return a shared result wrapper (for example `AppResult.Success` / `AppResult.Error`) so presentation logic does not parse low-level exceptions.

#### D) Retry and idempotency rules (locked)

1. **No automatic retry** for client errors (`4xx`) including auth/validation failures.
2. Retry only transient failures:
   - network I/O failures
   - timeout
   - `5xx` responses
3. Retry policy baseline:
   - `GET`: up to 2 retries with short exponential backoff + jitter
   - write operations (`POST/PUT/PATCH/DELETE`): no blind retries unless endpoint is idempotent
4. Payment/transfer endpoints must avoid duplicate submissions:
   - prefer explicit idempotency key support before enabling auto-retry on money movement calls.

#### E) Auth/header/401 handling (locked)

- Bearer token attached via OkHttp auth interceptor.
- On `401` from protected APIs, trigger centralized forced-logout flow:
  - clear local token/session
  - clear sensitive feature state
  - reset nav stack to Login (aligned with **§5.3** + **§7.3**).

### 7.5 Session and security policy (Q6 locked)

#### A) Token/session storage policy

1. Access JWT is stored only in encrypted local storage (`EncryptedSharedPreferences` or encrypted DataStore-backed storage).
2. Token must never be logged, printed, or included in crash breadcrumbs.
3. Session restore on app launch:
   - if token exists, attempt lightweight authenticated bootstrap (for example profile/wallet fetch)
   - if bootstrap returns `401`, immediately clear session and route to Login
4. Logout policy:
   - call backend logout endpoint as best effort
   - always clear local token/session and sensitive cached state
   - reset nav stack to Login

#### B) Biometric gating points (device-level authorization)

Use AndroidX `BiometricPrompt` for sensitive actions only:

- **Required biometric gate:**
  - final payment confirmation in send flow (`review -> verify -> submit`)
- **Recommended biometric gate (Phase 3):**
  - face template registration final confirmation
  - security-critical account actions (if introduced later)
- **No biometric gate needed:**
  - login/signup forms, browsing home/history/profile, recipient search, amount entry

#### C) Biometric fallback and failure behavior

1. If biometric is unavailable/not enrolled:
   - offer device credential fallback if product policy allows
   - otherwise block sensitive action with clear setup guidance
2. If biometric prompt is cancelled/fails:
   - stay on same secure step
   - allow controlled retry
3. Biometric success authorizes local action only; backend authorization still depends on valid token/API checks.

#### D) Session invalidation and app lock behavior

1. Any `401` on protected API triggers forced logout/reset (already locked in Q3/Q5).
2. Optional inactivity relock (Phase 4 hardening):
   - if app returns from background after configured idle period, require biometric before resuming sensitive flows.
3. Clear ephemeral sensitive UI state when leaving critical flows (for example partial transfer confirmation data).

### 7.6 Performance targets and pagination strategy (Q7 locked)

#### A) Performance targets (MVP baseline)

Targets should be validated on at least one representative mid-range Android device:

1. **Cold start (process dead -> first interactive frame):** target <= 2.0s
2. **Warm start (process alive -> usable screen):** target <= 1.0s
3. **Critical flow responsiveness:** send-flow step transitions should feel immediate (no blocking on main thread; visible loading state within ~150ms when network-bound)
4. **Scroll quality:** transaction/recipient lists should maintain smooth scroll without visible jank under normal dataset sizes
5. **Loading UX:** never freeze blank screen without feedback; use skeleton/spinner/error states by context

#### B) Skeleton/loading policy (locked)

1. **Skeleton loaders** for first-load content skeletons where layout is known:
   - Home summary blocks/cards
   - History transaction rows
   - Recipient list rows
   - Profile summary blocks
2. **Inline spinner/progress** for short inline actions:
   - button submits
   - compact refresh actions
3. **Pagination footer loader** for list "load more"
4. Skeleton is for **initial load only**; for refresh/pagination keep existing content visible and layer lightweight indicators.

#### C) Pagination strategy (locked)

1. Prefer **cursor-based pagination** if backend supports it; otherwise use stable page/limit pagination.
2. Default page size target: **20 items** (tunable after profiling).
3. Trigger next-page load when user nears list end (prefetch threshold, e.g. last 4-6 items).
4. Append new page to existing list; never clear previous page content during append.
5. If next-page load fails:
   - keep existing items on screen
   - show inline footer retry action
6. Pull-to-refresh resets pagination source (cursor/page) and reloads first page.

#### D) Retry and duplicate-prevention behavior in list paging

1. Prevent duplicate in-flight page requests for the same query/filter.
2. De-duplicate records by stable ID when appending pages.
3. Reset pagination state when filters/search/sort inputs change.
4. Preserve scroll position and loaded pages when navigating away/back during same session where feasible.

### 7.7 API inventory for Android implementation (locked reference)

Source of truth for this inventory:
- [`backend/src/app.ts`](../backend/src/app.ts) (mounted route prefixes)
- [`docs/thunder-client-api-testing.md`](./thunder-client-api-testing.md) (tested endpoint catalog)
- Frontend API client references:
  - [`frontend/src/shared/services/api.ts`](../frontend/src/shared/services/api.ts)
  - [`frontend/src/features/auth/api/authApi.ts`](../frontend/src/features/auth/api/authApi.ts)
  - [`frontend/src/features/send/api/sendApi.ts`](../frontend/src/features/send/api/sendApi.ts)

Primary backend origin (locked): `https://facepay-inrz.onrender.com`

#### Environment/base URL policy (locked)

- Use deployed backend endpoints directly as the default integration target.
- Android config stays environment-driven (`BuildConfig`/flavors), but production origin is the canonical default.

#### A) Health

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `GET` | `https://facepay-inrz.onrender.com/health` | No | Liveness check |

#### B) Auth

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `POST` | `https://facepay-inrz.onrender.com/api/v1/auth/signup` | No | Creates user + wallet, returns `{ user, token }` |
| `POST` | `https://facepay-inrz.onrender.com/api/v1/auth/login` | No | Returns `{ user, token }` |
| `POST` | `https://facepay-inrz.onrender.com/api/v1/auth/logout` | Bearer | Stateless logout hook (`204`) |

#### C) Users / recipient discovery

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `GET` | `https://facepay-inrz.onrender.com/api/v1/users` | Bearer | Query: `search`, `limit`, `cursor` |
| `GET` | `https://facepay-inrz.onrender.com/api/v1/users/:userId` | Bearer | Recipient/profile lookup |

#### D) Wallet

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `GET` | `https://facepay-inrz.onrender.com/api/v1/me/wallet/balance` | Bearer | Current balance |
| `POST` | `https://facepay-inrz.onrender.com/api/v1/me/wallet/add-funds` | Bearer | Demo top-up flow |

#### E) Transfers

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `POST` | `https://facepay-inrz.onrender.com/api/v1/transfers` | Bearer + `Idempotency-Key` | Money transfer, idempotent replay support |

#### F) Transactions/history

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `GET` | `https://facepay-inrz.onrender.com/api/v1/me/transactions` | Bearer | Query: `direction`, `search`, `limit`, `cursor` |

#### G) Face template

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `PUT` | `https://facepay-inrz.onrender.com/api/v1/me/face-template` | Bearer | Save descriptor |
| `GET` | `https://facepay-inrz.onrender.com/api/v1/me/face-template` | Bearer | Read descriptor (or `null`) |
| `DELETE` | `https://facepay-inrz.onrender.com/api/v1/me/face-template` | Bearer | Remove descriptor |

#### H) Profile and receive QR

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `GET` | `https://facepay-inrz.onrender.com/api/v1/me` | Bearer | Current profile |
| `GET` | `https://facepay-inrz.onrender.com/api/v1/me/security-summary` | Bearer | Security posture summary |
| `GET` | `https://facepay-inrz.onrender.com/api/v1/me/receive-qr` | Bearer | QR payload fields |

#### I) Android feature -> API mapping quick view

- `auth` -> signup, login, logout, me bootstrap
- `home` -> wallet balance + recent transactions
- `send` -> users list/detail + transfers
- `history` -> me transactions (paginated)
- `receive` -> me receive-qr
- `faceAuth` -> me face-template (PUT/GET/DELETE)
- `profile` -> me + me/security-summary

Implementation note: if backend endpoints change later, update this section and `thunder-client-api-testing.md` together.

---

## 8. Execution phases

## Phase 0 - Discovery and setup (1-3 days)

- Confirm exact MVP screens and user journeys.
- Freeze API contracts needed for Android MVP.
- Create new Android project (Compose template).
- Add core dependencies (Hilt, Retrofit, navigation, DataStore).
- Define package structure, coding conventions, and lint rules.

**Exit criteria:** app boots with navigation skeleton and base theme.

## Phase 1 - Foundation and auth (3-5 days)

- Build design system primitives (theme, text styles, buttons, inputs, scaffold).
- Implement auth flow (login/signup/session restore/logout).
- Add global error handling and loading patterns.

**Exit criteria:** user can authenticate and reach authenticated home shell.

## Phase 2 - Core wallet flows (5-8 days)

- Home data integration (balance + recent transactions).
- Send flow: select recipient -> amount -> review -> confirm.
- Success/failure screens with robust error handling.
- History list with basic filtering and pagination if needed.

**Exit criteria:** complete end-to-end payment flow works against backend.

## Phase 3 - Receive, profile, and verification polish (4-7 days)

- Receive flow (QR display and scan UX, as supported by API).
- Profile and account settings screens.
- Face verification UX integration + biometric guard where required.
- Improve empty states, retry states, and edge-case handling.

**Exit criteria:** all MVP journeys are functionally complete.

## Phase 4 - Hardening and release readiness (3-6 days)

- Unit tests for key ViewModels/use-cases.
- Compose UI tests for critical paths.
- Performance pass (startup, recomposition hotspots, network retries).
- Crash/error logging integration.
- Internal QA checklist and demo script.

**Exit criteria:** demo-ready build with acceptable stability and UX quality.

---

## 9. Definition of done (MVP)

- All core journeys in section 3 pass manual QA.
- Known high-severity bugs resolved.
- Basic tests and linting are green.
- Demo account/script prepared for presentations.
- Technical debt list captured for post-MVP iterations.

---

## 10. Immediate next actions

1. ~~Confirm package name, min SDK, and app naming conventions.~~ Done — see **§4.5(B)**.
2. ~~Confirm exact screen list for MVP parity with web.~~ Done — see **§3.3** and **§11** (Product/UI Q1).
3. ~~Confirm final dependency choices (serialization library, image loader, QR library).~~ Done — see **§4.5(A)**.
4. Start Phase 0 setup and commit Android skeleton.
5. Lock `debug/release` base URL implementation in Android config exactly as defined in **§4.5(C)**.
6. Set up Play App Signing + internal testing track workflow as defined in **§4.5(D)** before first release candidate.
7. Optional: add raster screenshots under [`designs/`](../designs/) (e.g. `designs/screenshots/`) if you want PNG/JPEG side-by-side QA in addition to Stitch HTML + web; link Figma only if it becomes the source of truth instead.

---

## 11. Frontend decision Q&A tracker

This section is a live checklist we will resolve one-by-one through Q&A.  
For each answered item: remove it from "Pending", add the final decision to "Locked decisions", and attach execution steps in "Implementation updates".

### 11.1 Pending decisions

None. All planned Q&A decisions are now locked.

### 11.2 Locked decisions

- Kotlin + Jetpack Compose (Material 3) as Android stack
- MVVM + feature-first architecture
- Retrofit + OkHttp networking baseline
- Hilt for dependency injection
- DataStore for preference/session storage
- **Product/UI (Q1):** Android MVP must **visually and structurally match the web app** (same screens as [`frontend/src/app/router.tsx`](../frontend/src/app/router.tsx)), using **Tailwind tokens** from [`frontend/tailwind.config.ts`](../frontend/tailwind.config.ts) and the same **Manrope + Poppins + Material Symbols** direction. **Pixel QA references** live in repo-root [`designs/`](../designs/) (Stitch HTML; optional raster screenshots under that folder). **No full redesign** unless a screen is impossible on mobile; then document a **minimal deviation** with rationale.
- **Design system (Q2):** Lock tokenization + reusable component-first approach from **§6.4** as mandatory baseline (colors, typography, spacing, shapes, elevation, motion, and shared FacePay components).
- **Navigation + auth gating (Q3):** Lock nested-graph navigation and tab/back-stack policy from **§5.3**, including route guards and `401`/logout stack reset behavior driven by backend auth constraints in **§7.3**.
- **Feature architecture + state contract (Q4):** Each **feature** (not each individual screen) owns `presentation/`, `domain/`, and `data/` layers. Screen groups that share business flow stay in one feature (for example `send/*` stays inside `feature/send`). ViewModels expose `UiState` via `StateFlow`, receive `UiEvent`, and emit one-time `UiEffect` for navigation/snackbar/toast.
- **API integration conventions (Q5):** Lock networking and data-boundary rules from **§7.4**: Retrofit + OkHttp + Kotlinx Serialization + Hilt + Coroutines/Flow, strict `DTO -> Domain -> UI` mapping, unified `AppResult`/error model, transient-only retry policy, and centralized `401` forced logout handling.
- **Session/security policy (Q6):** Lock token lifecycle and biometric security rules from **§7.5**: encrypted token storage, strict session clearing on logout/401, and biometric gating at payment confirmation (plus fallback/retry behavior).
- **Performance + pagination strategy (Q7):** Lock measurable performance targets and list loading behavior: initial skeleton policy, incremental pagination with append-safe UX, and transient-failure retry rules for feed/list screens.
- **Testing strategy (Q8):** Lock MVP-first test pyramid: fast unit tests for business/state logic, integration tests for repositories/network mapping/session flows, and Compose UI tests for critical user journeys and navigation guards.
- **Observability + release-readiness (Q9):** Lock production visibility baseline and pre-release quality gates: crash/error telemetry, privacy-safe diagnostics, and a must-pass shipping checklist.
- **Docker policy:** Skip Docker for Android app development; use host-native Android tooling. Docker remains optional for backend services only.

### 11.3 Implementation updates (added after each decision)

#### Product/UI — Q1 (2026-04-29)

1. **Decision:** Pursue **design parity with the web app** and repo [`designs/`](../designs/) (Stitch HTML and any screenshots there), not a new visual system. **No Android-only pages are missing** for MVP versus web: routes in `router.tsx` map 1:1 to the planned journeys. **Redesign:** not required for brand consistency; only allow **targeted layout adaptations** for mobile (safe area, keyboard, scroll, thumb reach).
2. **Why:** Single source of truth reduces design debt; Tailwind already encodes M3-like tokens; community and [Android guidance](https://developer.android.com/develop/ui/compose/designsystems/material) favor **Material 3 theme customization** in Compose rather than reinventing components.
3. **Execution plan:**
   - Extract a **Compose color scheme** from `tailwind.config.ts` (primary, surfaces, on-*, error, outline).
   - Define **Typography** (Manrope/Poppins weights and scales mirroring web headings vs body).
   - Audit each web **Page** + underlying **Screen** composables in `frontend/src/features/*/screens/` for layout blocks; list reusable Android components (e.g. primary button, text field, card, list row, app bar, bottom bar).
   - Mirror **tab destinations** like web BottomNav: Home, History, Receive, Profile; keep Send + face flows in a **nested graph** matching `/send/*` and `/register-face`.
   - Use **`designs/`** for per-screen visual QA: map each Android screen to the matching Stitch folder (login, home_dashboard, select_recipient, etc.). Add a short **per-screen checklist** (spacing, corner radius, shadows: `whisper`, `glow`, etc. from Tailwind). Raster PNG/JPEG exports, if any, should live under `designs/` (recommended: `designs/screenshots/`).
4. **Phase mapping:** **Phase 0** (token extraction + component inventory) + **Phase 1** (auth screens at full fidelity).

#### Design system tokens and reusable components — Q2 (2026-04-29)

1. **Decision:** Finalize Compose design system with a fixed token set and component inventory (see **§6.4**). Build feature screens only on top of these shared primitives/components.
2. **Why:** Keeps UI quality consistent with web/design references, prevents style drift, speeds delivery, and reduces rework across auth/home/send/receive/history/profile.
3. **Execution plan:**
   - Create `core/designsystem/theme` token files (`Color`, `Type`, `Shape`, `Elevation`, `Spacing`, `Motion`) and a single `FacePayTheme`.
   - Port Tailwind token values exactly first, then add only minimal app semantic aliases (`success`, `warning`, `info`) if required.
   - Implement foundation/state/domain reusable components listed in **§6.4(B)** before feature-heavy screen implementation.
   - Add a rule in code review: no hardcoded visual values in feature screens when a token/component exists.
4. **Phase mapping:** **Phase 0** (token files + base components) + **Phase 1** (apply to auth and shell) + **Phase 2/3** (domain components in wallet/send/receive flows).

#### Navigation graph and auth-gated routing — Q3 (2026-04-29)

1. **Decision:** Use a single-root Navigation Compose setup with nested `AuthGraph` and `MainGraph`; keep tab switching stateful (multi-back-stack behavior) and enforce auth guards based on stateless JWT backend behavior.
2. **Why:** Matches Android official guidance for bottom-nav state restoration, improves UX consistency, and prevents unauthorized back-stack leakage after logout or token expiry.
3. **Execution plan:**
   - Define typed route constants for root/auth/main/send/face/receive subflows.
   - Build root graph resolver from session state (`token + user`).
   - Implement bottom-tab navigation options (`launchSingleTop`, `restoreState`, `popUpTo(... saveState)`).
   - Centralize `401` handling in networking layer to trigger forced logout + stack reset.
   - Add navigation tests for guest/protected redirect and logout/back behavior.
4. **Phase mapping:** **Phase 0** (graph contract + route model) + **Phase 1** (auth graph and tab shell) + **Phase 2/3** (nested send/receive/face flows) + **Phase 4** (navigation tests hardening).

#### Feature architecture and ViewModel/UI state contract — Q4 (2026-04-29)

1. **Decision:** Use a **feature-first layered structure** where each feature contains `presentation/`, `domain/`, and `data/`. Do **not** create separate `data/domain` for every single UI screen unless it has independent business/data boundaries.
2. **Why:** This is the practical industry pattern for medium apps: high cohesion inside a feature, low coupling across features, fewer duplicate abstractions, and clearer ownership.
3. **Execution plan:**
   - Define feature packages/modules: `auth`, `home`, `send`, `receive`, `history`, `profile`, `faceAuth`.
   - Keep full send journey (`selectRecipient`, `amount`, `review`, `verify`, `success/failed`) inside `feature/send`.
   - In each feature: `presentation` (screens, ViewModel, UI models), `domain` (use cases, domain models/interfaces), `data` (repository impl, remote/local sources, DTO mappers).
   - Standardize ViewModel contract: `UiState` (`StateFlow`), `onEvent(UiEvent)`, `UiEffect` for one-off actions.
4. **Phase mapping:** **Phase 0** (folder contract and templates) + **Phase 1** (auth/home adoption) + **Phase 2/3** (send/receive/history/profile/faceAuth adoption) + **Phase 4** (contract consistency checks in code review/tests).

#### API integration conventions (DTO mapping, error model, retry rules) — Q5 (2026-04-29)

1. **Decision:** Use Retrofit + OkHttp + Kotlinx Serialization with Hilt and Coroutines/Flow; enforce strict `DTO -> Domain -> UI` boundaries and a single app-level error/result contract.
2. **Why:** Prevents API-shape leakage into UI, gives consistent failure handling across features, and reduces risk in critical money flows by controlling retries.
3. **Execution plan:**
   - Build core network setup (Retrofit, OkHttp interceptors, serializer config, timeout/logging policy).
   - Define shared `AppResult` + `AppError` contract and map all repository failures to it.
   - Implement per-feature DTO/domain mapper files in `data/mapper`.
   - Centralize `401` interceptor/handler integration with session manager and nav reset logic.
   - Add tests for mapping, error translation, and retry behavior (including transfer no-duplicate guarantees).
4. **Phase mapping:** **Phase 0** (network core + contracts) + **Phase 1** (auth integration + 401/logout flow) + **Phase 2/3** (feature API rollout) + **Phase 4** (resilience and retry tests).

#### Session/security policy (token storage, biometric gating points) — Q6 (2026-04-29)

1. **Decision:** Use encrypted token storage with strict session invalidation (`401` and logout) and apply biometric gating to sensitive payment confirmation points.
2. **Why:** Balances security and UX for a fintech-like flow: protects session misuse risk while avoiding unnecessary biometric prompts in normal browsing.
3. **Execution plan:**
   - Implement `SessionManager` with encrypted token read/write/clear and bootstrap validation behavior.
   - Enforce centralized forced-logout pipeline on `401` (token clear + state clear + nav reset).
   - Integrate `BiometricPrompt` in send confirmation step; define fallback and retry UX.
   - Add security checks to prevent token logging and sanitize error/reporting metadata.
   - Add tests for logout/session-clear behavior and biometric-gated payment submit path.
4. **Phase mapping:** **Phase 0** (session contract + storage decision) + **Phase 1** (auth/session restore/logout) + **Phase 2** (payment biometric gate) + **Phase 4** (inactivity relock and hardening tests).

#### Performance targets and pagination strategy — Q7 (2026-04-29)

1. **Decision:** Set explicit performance baselines and lock list pagination behavior with skeleton-first initial loading and append-safe infinite scrolling.
2. **Why:** Makes UX quality measurable, avoids regressions, and prevents common list issues (jank, duplicate items, full-screen flicker on pagination errors).
3. **Execution plan:**
   - Define startup and interaction KPIs in QA checklist (`cold/warm start`, scroll smoothness, loading feedback timing).
   - Implement skeleton components for first-load on key list/content screens.
   - Standardize paginated list contract (page size, prefetch threshold, append semantics, footer retry).
   - Ensure refresh/filter changes reset pagination state correctly.
   - Add instrumentation checks for large-list scroll and pagination failure/retry behavior.
4. **Phase mapping:** **Phase 0** (KPI definitions + list contract) + **Phase 1/2** (implement history/recipient/home list patterns) + **Phase 3** (polish and edge cases) + **Phase 4** (performance validation and tuning).

#### Testing strategy (unit, integration, Compose UI) — Q8 (2026-04-29)

1. **Decision:** Adopt an MVP-first test pyramid: prioritize high-value unit tests, add focused integration tests around data/session edges, and cover critical user journeys with Compose UI tests.
2. **Why:** Gives fast developer feedback, reduces regression risk in payment/auth flows, and keeps test effort proportional for a solo/early-stage build.
3. **Execution plan:**
   - **Unit tests (required baseline):**
     - ViewModel state transitions (`loading/success/error`) for auth, send, history.
     - Use case and mapper correctness (`DTO <-> domain`, error mapping, pagination merge behavior).
     - Session manager behavior (`save/restore/clear`, 401-triggered invalidation).
   - **Integration tests (focused):**
     - Repository + mock server contract tests (status codes, payload mapping, retry policy).
     - Auth bootstrap flow (token exists -> profile bootstrap -> success/failure routes).
     - Transfer submission guardrails (no duplicate submit path under transient failure).
   - **Compose UI tests (critical journeys):**
     - Login/signup success and error rendering.
     - Auth-guarded navigation behavior (guest/protected redirects).
     - Send-money happy path and failure/biometric retry states.
     - History pagination UI states (initial skeleton, append loader, footer retry).
   - Add deterministic coroutine/test dispatcher setup and reusable test fixtures/fakes in shared testing utilities.
4. **Phase mapping:** **Phase 0** (test framework setup and fixtures) + **Phase 1** (auth unit/UI tests) + **Phase 2/3** (send/history/receive integration + UI tests) + **Phase 4** (regression hardening and CI gating thresholds).

#### Observability and release-readiness checklist — Q9 (2026-04-29)

1. **Decision:** Establish production observability as a default capability and enforce a must-pass release checklist before any investor/demo/public build.
2. **Why:** Fast failure diagnosis and disciplined release gates reduce production risk, shorten incident resolution time, and prevent avoidable shipping regressions in auth/payment-sensitive flows.
3. **Execution plan:**
   - **Observability baseline:**
     - Integrate crash reporting (for example Sentry/Firebase Crashlytics) in release builds.
     - Capture structured non-fatal errors for critical flows (auth, transfers, session restore, QR/face flows).
     - Add privacy-safe breadcrumbs (screen + action trail) without tokens, passwords, biometric payloads, or raw PII.
     - Include release metadata in telemetry (`app version`, `build type`, `device/OS`, optional request correlation IDs).
   - **Diagnostics policy:**
     - Redact all secrets and sensitive headers in logs.
     - Debug logging only in non-release builds.
     - Normalize errors through `AppError` to keep analytics/monitoring dimensions stable.
   - **Release-readiness checklist (must-pass):**
     - Build config validated (`release` signing, minify/proguard/r8 config, no debug toggles).
     - API environment and keys verified for target environment.
     - Auth/session/logout and `401` forced-logout behavior verified manually.
     - Send/verify/success and failure-retry paths validated on real device.
     - Crash reporting smoke test confirmed in internal build.
     - Core automated tests green (unit/integration/UI critical set).
     - Performance spot-check passed against Q7 thresholds.
     - Permissions/privacy copy and user-facing error messaging reviewed.
   - **Operational readiness:**
     - Maintain a short runbook for common failures (login failures, 401 loops, transfer submit issues).
     - Tag releases and keep a rollback plan for internal distribution channels.
4. **Phase mapping:** **Phase 1** (telemetry wiring baseline) + **Phase 2/3** (flow-level non-fatal instrumentation) + **Phase 4** (full release checklist enforcement and operational runbook).

Use this template for every finalized item:

1. **Decision:** [final choice]
2. **Why:** [brief rationale]
3. **Execution plan:** [clear steps to implement]
4. **Phase mapping:** [Phase 0/1/2/3/4]

