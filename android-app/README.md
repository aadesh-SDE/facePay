# FacePay Android

Native Android client (Kotlin, Jetpack Compose). Open this folder in Android Studio or run `./gradlew :app:assembleDebug` from `android-app/`.

Phase 0 delivers a bootable app with navigation placeholders, Material 3 theme tokens aligned with the web Tailwind palette, and `BuildConfig.API_BASE_URL` pointing at the deployed backend.

## SDK path

Gradle needs the Android SDK. Either open the project in Android Studio (it writes `local.properties`) or copy `local.properties.example` to `local.properties` and set `sdk.dir` to your SDK (on Windows, often `%LOCALAPPDATA%\\Android\\Sdk`).

## Debug API base URL

Per `docs/android-plan.md` §4.5(C), release builds always use the deployed backend. For **debug** only, you can set `facepay.apiBaseUrl` in `local.properties`, or set env var `FACEPAY_API_BASE_URL`, otherwise the default is `https://facepay-inrz.onrender.com`.

## Lint

From `android-app/`, run `./gradlew detekt ktlintCheck` (also runs as part of `./gradlew :app:check`).
