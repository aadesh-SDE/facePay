package com.facepay.android.core.session

import com.facepay.android.core.coroutines.ApplicationScope
import com.facepay.android.core.coroutines.IoDispatcher
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UnauthorizedNotifierImpl
    @Inject
    constructor(
        private val secureTokenStore: SecureTokenStore,
        private val tokenHolder: TokenHolder,
        private val sessionStateHolder: SessionStateHolder,
        @ApplicationScope private val applicationScope: CoroutineScope,
        @IoDispatcher private val ioDispatcher: CoroutineDispatcher,
    ) : UnauthorizedNotifier {
        override fun onUnauthorized() {
            applicationScope.launch(ioDispatcher) {
                secureTokenStore.clearToken()
                tokenHolder.setToken(null)
                sessionStateHolder.set(SessionUiState.Unauthenticated)
            }
        }
    }
