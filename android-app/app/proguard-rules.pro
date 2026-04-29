# Retrofit / OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Kotlin serialization
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt
-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}
-keepclasseswithmembers class **$$serializer {
    *** INSTANCE;
}
-keepclassmembers class **$* {
    *** INSTANCE;
    kotlinx.serialization.KSerializer serializer(...);
}

# Hilt
-dontwarn com.google.errorprone.annotations.**
