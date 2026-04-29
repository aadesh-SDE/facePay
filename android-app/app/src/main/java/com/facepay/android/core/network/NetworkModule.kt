package com.facepay.android.core.network

import com.facepay.android.BuildConfig
import com.facepay.android.feature.auth.data.remote.AuthApi
import com.facepay.android.feature.auth.data.remote.MeApi
import com.jakewharton.retrofit2.converter.kotlinx.serialization.asConverterFactory
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun json(): Json =
        Json {
            ignoreUnknownKeys = true
            isLenient = true
        }

    @Provides
    @Singleton
    fun loggingInterceptor(): HttpLoggingInterceptor =
        HttpLoggingInterceptor().apply {
            level =
                if (BuildConfig.DEBUG) {
                    HttpLoggingInterceptor.Level.BODY
                } else {
                    HttpLoggingInterceptor.Level.NONE
                }
        }

    @Provides
    @Singleton
    fun okHttpClient(
        authInterceptor: AuthInterceptor,
        unauthorizedInterceptor: UnauthorizedInterceptor,
        loggingInterceptor: HttpLoggingInterceptor,
    ): OkHttpClient =
        OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .addInterceptor(authInterceptor)
            .addInterceptor(loggingInterceptor)
            .addInterceptor(unauthorizedInterceptor)
            .build()

    @Provides
    @Singleton
    fun retrofit(
        client: OkHttpClient,
        json: Json,
    ): Retrofit {
        val base = BuildConfig.API_BASE_URL.trimEnd('/') + "/api/v1/"
        return Retrofit.Builder()
            .baseUrl(base)
            .client(client)
            .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
            .build()
    }

    @Provides
    @Singleton
    fun authApi(retrofit: Retrofit): AuthApi = retrofit.create(AuthApi::class.java)

    @Provides
    @Singleton
    fun meApi(retrofit: Retrofit): MeApi = retrofit.create(MeApi::class.java)
}
