package com.facepay.android.core.network

import com.facepay.android.core.session.TokenHolder
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthInterceptor
    @Inject
    constructor(
        private val tokenHolder: TokenHolder,
    ) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val token = tokenHolder.peek() ?: return chain.proceed(chain.request())
            val request =
                chain.request().newBuilder()
                    .header("Authorization", "Bearer $token")
                    .build()
            return chain.proceed(request)
        }
    }
