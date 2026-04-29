package com.facepay.android.feature.auth.data.repository

import com.facepay.android.core.common.AppResult
import com.facepay.android.core.network.toAppError
import com.facepay.android.feature.auth.data.remote.AuthApi
import com.facepay.android.feature.auth.data.remote.dto.AuthResponseDto
import com.facepay.android.feature.auth.data.remote.dto.LoginRequestDto
import com.facepay.android.feature.auth.data.remote.dto.SignupRequestDto
import com.facepay.android.feature.auth.domain.repository.AuthRepository
import kotlinx.serialization.json.Json
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl
    @Inject
    constructor(
        private val authApi: AuthApi,
        private val json: Json,
    ) : AuthRepository {
        override suspend fun login(
            mobile: String,
            password: String,
        ): AppResult<AuthResponseDto> =
            try {
                val normalized = mobile.filterNot { it.isWhitespace() }
                AppResult.Success(
                    authApi.login(
                        LoginRequestDto(
                            mobile = normalized,
                            password = password,
                        ),
                    ),
                )
            } catch (e: IOException) {
                AppResult.Error(e.toAppError(json))
            } catch (e: HttpException) {
                AppResult.Error(e.toAppError(json))
            }

        override suspend fun signup(
            name: String,
            mobile: String,
            email: String,
            password: String,
        ): AppResult<AuthResponseDto> =
            try {
                AppResult.Success(
                    authApi.signup(
                        SignupRequestDto(
                            name = name.trim(),
                            mobile = mobile.filterNot { it.isWhitespace() },
                            email = email.trim().lowercase(),
                            password = password,
                        ),
                    ),
                )
            } catch (e: IOException) {
                AppResult.Error(e.toAppError(json))
            } catch (e: HttpException) {
                AppResult.Error(e.toAppError(json))
            }
    }
