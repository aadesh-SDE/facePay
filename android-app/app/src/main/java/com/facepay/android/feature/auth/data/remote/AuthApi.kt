package com.facepay.android.feature.auth.data.remote

import com.facepay.android.feature.auth.data.remote.dto.AuthResponseDto
import com.facepay.android.feature.auth.data.remote.dto.LoginRequestDto
import com.facepay.android.feature.auth.data.remote.dto.SignupRequestDto
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/login")
    suspend fun login(
        @Body body: LoginRequestDto,
    ): AuthResponseDto

    @POST("auth/signup")
    suspend fun signup(
        @Body body: SignupRequestDto,
    ): AuthResponseDto

    @POST("auth/logout")
    suspend fun logout()
}
