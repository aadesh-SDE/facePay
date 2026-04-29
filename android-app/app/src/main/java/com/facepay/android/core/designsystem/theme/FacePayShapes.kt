package com.facepay.android.core.designsystem.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes

val FacePayShapes =
    Shapes(
        extraSmall = RoundedCornerShape(FpCornerRadius.default),
        small = RoundedCornerShape(FpCornerRadius.default),
        medium = RoundedCornerShape(FpCornerRadius.large),
        large = RoundedCornerShape(FpCornerRadius.large),
        extraLarge = RoundedCornerShape(FpCornerRadius.extraLarge),
    )
