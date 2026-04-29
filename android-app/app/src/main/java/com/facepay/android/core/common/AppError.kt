package com.facepay.android.core.common

sealed class AppError(val message: String) {
    class Network(message: String = "Network error") : AppError(message)

    class Unauthorized(message: String = "Session expired") : AppError(message)

    class Forbidden(message: String) : AppError(message)

    class NotFound(message: String) : AppError(message)

    class Validation(message: String) : AppError(message)

    class Conflict(message: String) : AppError(message)

    class Server(message: String = "Server error") : AppError(message)

    class Unknown(message: String = "Something went wrong") : AppError(message)
}
