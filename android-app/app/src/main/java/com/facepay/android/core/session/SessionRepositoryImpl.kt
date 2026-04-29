package com.facepay.android.core.session

import com.facepay.android.core.coroutines.IoDispatcher
import com.facepay.android.feature.auth.data.mapper.toDomain
import com.facepay.android.feature.auth.data.remote.AuthApi
import com.facepay.android.feature.auth.data.remote.MeApi
import com.facepay.android.feature.auth.data.remote.dto.AuthResponseDto
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.withContext
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SessionRepositoryImpl
    @Inject
    constructor(
        private val authApi: AuthApi,
        private val meApi: MeApi,
        private val secureTokenStore: SecureTokenStore,
        private val tokenHolder: TokenHolder,
        private val sessionStateHolder: SessionStateHolder,
        @IoDispatcher private val ioDispatcher: CoroutineDispatcher,
    ) : SessionRepository {
        override val sessionState: StateFlow<SessionUiState> = sessionStateHolder.state

        override suspend fun bootstrap() {
            sessionStateHolder.set(SessionUiState.Bootstrapping)
            val token =
                withContext(ioDispatcher) {
                    secureTokenStore.readToken()
                }
            if (token.isNullOrBlank()) {
                tokenHolder.setToken(null)
                sessionStateHolder.set(SessionUiState.Unauthenticated)
                return
            }
            tokenHolder.setToken(token)
            try {
                val me = meApi.getMe()
                sessionStateHolder.set(SessionUiState.Authenticated(me.toDomain()))
            } catch (_: HttpException) {
                clearLocal()
                sessionStateHolder.set(SessionUiState.Unauthenticated)
            } catch (_: IOException) {
                tokenHolder.setToken(null)
                sessionStateHolder.set(SessionUiState.Unauthenticated)
            }
        }

        override suspend fun persistAuth(response: AuthResponseDto) {
            withContext(ioDispatcher) {
                secureTokenStore.writeToken(response.token)
            }
            tokenHolder.setToken(response.token)
            sessionStateHolder.set(SessionUiState.Authenticated(response.user.toDomain()))
        }

        override suspend fun logout() {
            try {
                authApi.logout()
            } catch (_: Exception) {
                // Best-effort server logout; always clear client session (plan §7.3).
            }
            withContext(ioDispatcher) {
                clearLocal()
            }
            sessionStateHolder.set(SessionUiState.Unauthenticated)
        }

        private fun clearLocal() {
            secureTokenStore.clearToken()
            tokenHolder.setToken(null)
        }
    }
