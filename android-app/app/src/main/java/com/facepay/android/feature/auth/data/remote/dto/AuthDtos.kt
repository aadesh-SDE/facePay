package com.facepay.android.feature.auth.data.remote.dto

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequestDto(
    val mobile: String,
    val password: String,
)

@Serializable
data class SignupRequestDto(
    val name: String,
    val mobile: String,
    val email: String,
    val password: String,
)

@Serializable
data class UserDto(
    val id: String,
    val name: String,
    val mobile: String,
    val email: String,
    val avatar: String? = null,
)

@Serializable
data class AuthResponseDto(
    val user: UserDto,
    val token: String,
)

@Serializable
data class MeResponseDto(
    val id: String,
    val name: String,
    val mobile: String,
    val email: String,
    val joinedAt: String,
    val faceRegistered: Boolean,
    val avatar: String? = null,
)

@Serializable
data class ApiErrorBodyDto(
    val code: String? = null,
    val message: String? = null,
)
