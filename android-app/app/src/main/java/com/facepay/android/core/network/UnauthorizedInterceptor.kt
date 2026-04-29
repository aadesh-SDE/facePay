package com.facepay.android.core.network

import com.facepay.android.core.coroutines.ApplicationScope
import com.facepay.android.core.session.UnauthorizedNotifier
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UnauthorizedInterceptor
    @Inject
    constructor(
        private val notifier: UnauthorizedNotifier,
        @ApplicationScope private val applicationScope: CoroutineScope,
    ) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val response = chain.proceed(chain.request())
            val path = chain.request().url.encodedPath
            val isAuthPublic =
                path.contains("auth/login", ignoreCase = true) ||
                    path.contains("auth/signup", ignoreCase = true)
            if (response.code == 401 && !isAuthPublic) {
                applicationScope.launch { notifier.onUnauthorized() }
            }
            return response
        }
    }
