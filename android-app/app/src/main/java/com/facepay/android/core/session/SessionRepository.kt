package com.facepay.android.core.session

import com.facepay.android.feature.auth.data.remote.dto.AuthResponseDto
import kotlinx.coroutines.flow.StateFlow

interface SessionRepository {
    val sessionState: StateFlow<SessionUiState>

    suspend fun bootstrap()

    suspend fun persistAuth(response: AuthResponseDto)

    suspend fun logout()
}
