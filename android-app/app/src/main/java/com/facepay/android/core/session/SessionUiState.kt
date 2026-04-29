package com.facepay.android.core.session

import com.facepay.android.feature.auth.domain.model.User

enum class BootstrapFailureReason {
    /** Timeouts, DNS, no connectivity, etc. */
    Network,

    /** Non-401 HTTP errors or unexpected failures after retries. */
    Server,
}

sealed interface SessionUiState {
    data object Bootstrapping : SessionUiState

    data object Unauthenticated : SessionUiState

    data class Authenticated(val user: User) : SessionUiState

    /** Valid token on disk but /me could not be loaded; session is not cleared (plan §7.5). */
    data class BootstrapFailed(val reason: BootstrapFailureReason) : SessionUiState
}
