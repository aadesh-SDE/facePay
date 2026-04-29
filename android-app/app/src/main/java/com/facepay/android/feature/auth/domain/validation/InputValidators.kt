package com.facepay.android.feature.auth.domain.validation

private val mobileRegex = Regex("^[6-9]\\d{9}$")
private val emailRegex = Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")

fun isValidMobile(mobile: String): Boolean = mobileRegex.matches(mobile.filterNot { it.isWhitespace() })

fun isValidEmail(email: String): Boolean = emailRegex.matches(email.trim())

fun validatePassword(password: String): String? =
    when {
        password.length < 6 -> "Password must be at least 6 characters"
        else -> null
    }

fun validateName(name: String): String? =
    when {
        name.trim().length < 2 -> "Name must be at least 2 characters"
        else -> null
    }
