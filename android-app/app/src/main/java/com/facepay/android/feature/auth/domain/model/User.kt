package com.facepay.android.feature.auth.domain.model

data class User(
    val id: String,
    val name: String,
    val mobile: String,
    val email: String,
    val avatar: String? = null,
)
