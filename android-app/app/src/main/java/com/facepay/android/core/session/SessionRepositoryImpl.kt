package com.facepay.android.core.session

import com.facepay.android.core.coroutines.IoDispatcher
import com.facepay.android.feature.auth.data.mapper.toDomain
import com.facepay.android.feature.auth.data.remote.AuthApi
import com.facepay.android.feature.auth.data.remote.MeApi
import com.facepay.android.feature.auth.data.remote.dto.AuthResponseDto
import com.facepay.android.feature.auth.data.remote.dto.MeResponseDto
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.withContext
import retrofit2.HttpException
import java.io.IOException
import java.net.HttpURLConnection
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.random.Random

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
                val me = fetchMeWithRetries()
                sessionStateHolder.set(SessionUiState.Authenticated(me.toDomain()))
            } catch (e: HttpException) {
                if (e.code() == HttpURLConnection.HTTP_UNAUTHORIZED) {
                    withContext(ioDispatcher) {
                        clearLocal()
                    }
                    sessionStateHolder.set(SessionUiState.Unauthenticated)
                } else {
                    sessionStateHolder.set(
                        SessionUiState.BootstrapFailed(BootstrapFailureReason.Server),
                    )
                }
            } catch (_: IOException) {
                sessionStateHolder.set(
                    SessionUiState.BootstrapFailed(BootstrapFailureReason.Network),
                )
            } catch (_: Exception) {
                sessionStateHolder.set(
                    SessionUiState.BootstrapFailed(BootstrapFailureReason.Server),
                )
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

        override suspend fun discardLocalSession() {
            withContext(ioDispatcher) {
                clearLocal()
            }
            sessionStateHolder.set(SessionUiState.Unauthenticated)
        }

        /**
         * Plan §7.4.D: GET with up to 2 retries on transient I/O and selected 5xx.
         */
        @Suppress("ThrowsCount")
        private suspend fun fetchMeWithRetries(): MeResponseDto {
            var attempt = 0
            var lastError: Exception? = null
            while (attempt < MAX_ME_FETCH_ATTEMPTS) {
                try {
                    return meApi.getMe()
                } catch (e: HttpException) {
                    if (e.code() == HttpURLConnection.HTTP_UNAUTHORIZED) {
                        throw e
                    }
                    if (e.code() !in RETRYABLE_HTTP_CODES || attempt >= MAX_ME_FETCH_ATTEMPTS - 1) {
                        throw e
                    }
                    lastError = e
                } catch (e: IOException) {
                    if (attempt >= MAX_ME_FETCH_ATTEMPTS - 1) {
                        throw e
                    }
                    lastError = e
                }
                attempt++
                delay(backoffMillis(attempt))
            }
            error(lastError?.message ?: "bootstrap: exhausted retries without error")
        }

        private fun clearLocal() {
            secureTokenStore.clearToken()
            tokenHolder.setToken(null)
        }

        private companion object {
            const val MAX_ME_FETCH_ATTEMPTS = 3
            val RETRYABLE_HTTP_CODES = setOf(502, 503, 504)

            fun backoffMillis(attemptIndex: Int): Long {
                val base = BASE_BACKOFF_MS * (1 shl attemptIndex)
                val jitter = Random.nextInt(0, JITTER_CEILING_EXCLUSIVE).toLong()
                return base + jitter
            }

            private const val BASE_BACKOFF_MS = 250L
            private const val JITTER_CEILING_EXCLUSIVE = 51
        }
    }
