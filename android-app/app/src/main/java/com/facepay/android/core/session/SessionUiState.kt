package com.facepay.android.core.session

import com.facepay.android.feature.auth.domain.model.User

sealed interface SessionUiState {
    data object Bootstrapping : SessionUiState

    data object Unauthenticated : SessionUiState

    data class Authenticated(val user: User) : SessionUiState
}
