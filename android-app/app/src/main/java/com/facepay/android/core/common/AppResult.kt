package com.facepay.android.core.common

sealed class AppResult<out T> {
    data class Success<T>(val data: T) : AppResult<T>()

    data class Error(val error: AppError) : AppResult<Nothing>()
}

inline fun <T> AppResult<T>.onSuccess(block: (T) -> Unit): AppResult<T> {
    if (this is AppResult.Success) block(data)
    return this
}

inline fun <T> AppResult<T>.onError(block: (AppError) -> Unit): AppResult<T> {
    if (this is AppResult.Error) block(error)
    return this
}
