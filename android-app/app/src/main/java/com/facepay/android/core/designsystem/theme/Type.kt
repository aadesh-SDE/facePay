package com.facepay.android.core.designsystem.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Manrope/Poppins (plan §3.3): ship font resources or Google Font provider in a later phase; sans-serif for now.
private val DefaultFontFamily = FontFamily.SansSerif

val FacePayTypography =
    Typography(
        displayLarge =
            TextStyle(
                fontFamily = DefaultFontFamily,
                fontWeight = FontWeight.Bold,
                fontSize = 57.sp,
                lineHeight = 64.sp,
            ),
        headlineMedium =
            TextStyle(
                fontFamily = DefaultFontFamily,
                fontWeight = FontWeight.SemiBold,
                fontSize = 28.sp,
                lineHeight = 36.sp,
            ),
        headlineSmall =
            TextStyle(
                fontFamily = DefaultFontFamily,
                fontWeight = FontWeight.SemiBold,
                fontSize = 24.sp,
                lineHeight = 32.sp,
            ),
        bodyLarge =
            TextStyle(
                fontFamily = DefaultFontFamily,
                fontWeight = FontWeight.Normal,
                fontSize = 16.sp,
                lineHeight = 24.sp,
            ),
        bodySmall =
            TextStyle(
                fontFamily = DefaultFontFamily,
                fontWeight = FontWeight.Normal,
                fontSize = 12.sp,
                lineHeight = 16.sp,
            ),
        labelLarge =
            TextStyle(
                fontFamily = DefaultFontFamily,
                fontWeight = FontWeight.Medium,
                fontSize = 14.sp,
                lineHeight = 20.sp,
            ),
    )
