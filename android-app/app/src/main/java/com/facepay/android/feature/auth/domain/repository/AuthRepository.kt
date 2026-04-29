package com.facepay.android.feature.auth.domain.repository

import com.facepay.android.core.common.AppResult
import com.facepay.android.feature.auth.data.remote.dto.AuthResponseDto

interface AuthRepository {
    suspend fun login(
        mobile: String,
        password: String,
    ): AppResult<AuthResponseDto>

    suspend fun signup(
        name: String,
        mobile: String,
        email: String,
        password: String,
    ): AppResult<AuthResponseDto>
}
