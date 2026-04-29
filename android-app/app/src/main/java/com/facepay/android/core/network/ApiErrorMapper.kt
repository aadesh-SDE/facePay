package com.facepay.android.core.network

import com.facepay.android.core.common.AppError
import com.facepay.android.feature.auth.data.remote.dto.ApiErrorBodyDto
import kotlinx.serialization.json.Json
import retrofit2.HttpException
import java.io.IOException

fun mapHttpException(
    e: HttpException,
    json: Json,
): AppError {
    val body =
        runCatching {
            val raw =
                e.response()?.errorBody()?.use { it.string() }?.takeIf { it.isNotBlank() }
                    ?: return@runCatching null
            json.decodeFromString(ApiErrorBodyDto.serializer(), raw)
        }.getOrNull()
    val message = body?.message?.takeIf { it.isNotBlank() } ?: e.message()

    return when (e.code()) {
        401 -> AppError.Unauthorized(message)
        403 -> AppError.Forbidden(message)
        404 -> AppError.NotFound(message)
        409 -> AppError.Conflict(message)
        in 400..499 -> AppError.Validation(message)
        in 500..599 -> AppError.Server(message)
        else -> AppError.Unknown(message)
    }
}

fun Throwable.toAppError(json: Json): AppError =
    when (this) {
        is HttpException -> mapHttpException(this, json)
        is IOException -> AppError.Network(message ?: "Network error")
        else -> AppError.Unknown(message ?: "Something went wrong")
    }
