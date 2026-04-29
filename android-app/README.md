# FacePay Android

Native Android client (Kotlin, Jetpack Compose). Open this folder in Android Studio or run `./gradlew :app:assembleDebug` from `android-app/`.

Phase 0 delivers a bootable app with navigation placeholders, Material 3 theme tokens aligned with the web Tailwind palette, and `BuildConfig.API_BASE_URL` pointing at the deployed backend.

**Phase 1** adds login/signup against `/api/v1/auth/*`, encrypted token storage, `GET /api/v1/me` bootstrap, bearer auth + 401 handling (mirrors web `api.ts`), and a minimal authenticated home shell with logout.

Bootstrap follows `docs/android-plan.md` §7.4–7.5: only **401** clears the session; transient **I/O** and **502/503/504** on `/me` get up to two retries with backoff; other failures show **Try again** / **Use another account** without wiping the token unless the user signs out. Debug HTTP logs **redact** `Authorization`. Release builds set `android:allowBackup="false"`. Coil, CameraX, and ML Kit are not on the classpath until receive/QR work (Phase 3); run `./gradlew :app:testDebugUnitTest` for session bootstrap unit tests.

## SDK path

Gradle needs the Android SDK. Either open the project in Android Studio (it writes `local.properties`) or copy `local.properties.example` to `local.properties` and set `sdk.dir` to your SDK (on Windows, often `%LOCALAPPDATA%\\Android\\Sdk`).

## Debug API base URL

Per `docs/android-plan.md` §4.5(C), release builds always use the deployed backend. For **debug** only, you can set `facepay.apiBaseUrl` in `local.properties`, or set env var `FACEPAY_API_BASE_URL`, otherwise the default is `https://facepay-inrz.onrender.com`.

## Lint

From `android-app/`, run `./gradlew detekt ktlintCheck` (also runs as part of `./gradlew :app:check`).
