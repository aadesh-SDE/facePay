package com.facepay.android.core.session

import java.util.concurrent.atomic.AtomicReference
import javax.inject.Inject
import javax.inject.Singleton

/** In-memory bearer token for OkHttp; never log this value. */
@Singleton
class TokenHolder
    @Inject
    constructor() {
        private val token = AtomicReference<String?>(null)

        fun setToken(value: String?) {
            token.set(value)
        }

        fun peek(): String? = token.get()
    }
