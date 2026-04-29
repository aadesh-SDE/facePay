package com.facepay.android

import androidx.compose.runtime.Composable
import androidx.navigation.compose.rememberNavController
import com.facepay.android.navigation.RootNavHost

@Composable
fun FacePayApp() {
    val navController = rememberNavController()
    RootNavHost(navController = navController)
}
