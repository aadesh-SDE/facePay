package com.facepay.android.feature.auth.data.remote

import com.facepay.android.feature.auth.data.remote.dto.MeResponseDto
import retrofit2.http.GET

interface MeApi {
    @GET("me")
    suspend fun getMe(): MeResponseDto
}
