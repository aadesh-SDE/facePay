package com.facepay.android.feature.auth.data.mapper

import com.facepay.android.feature.auth.data.remote.dto.MeResponseDto
import com.facepay.android.feature.auth.data.remote.dto.UserDto
import com.facepay.android.feature.auth.domain.model.User

fun UserDto.toDomain(): User =
    User(
        id = id,
        name = name,
        mobile = mobile,
        email = email,
        avatar = avatar,
    )

fun MeResponseDto.toDomain(): User =
    User(
        id = id,
        name = name,
        mobile = mobile,
        email = email,
        avatar = avatar,
    )
