# FacePay Android

Native Android client (Kotlin, Jetpack Compose). Open this folder in Android Studio or run `./gradlew :app:assembleDebug` from `android-app/`.

Phase 0 delivers a bootable app with navigation placeholders, Material 3 theme tokens aligned with the web Tailwind palette, and `BuildConfig.API_BASE_URL` pointing at the deployed backend.

## SDK path

Gradle needs the Android SDK. Either open the project in Android Studio (it writes `local.properties`) or copy `local.properties.example` to `local.properties` and set `sdk.dir` to your SDK (on Windows, often `%LOCALAPPDATA%\\Android\\Sdk`).
