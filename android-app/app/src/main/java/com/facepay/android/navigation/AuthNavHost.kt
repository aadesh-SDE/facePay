package com.facepay.android.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.facepay.android.feature.auth.presentation.screen.LoginScreen
import com.facepay.android.feature.auth.presentation.screen.SignupScreen

@Composable
fun AuthNavHost(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = Routes.LOGIN,
        modifier = modifier,
    ) {
        composable(Routes.LOGIN) {
            LoginScreen(
                onNavigateToSignup = { navController.navigate(Routes.SIGNUP) },
            )
        }
        composable(Routes.SIGNUP) {
            SignupScreen(
                onNavigateBack = { navController.popBackStack() },
            )
        }
    }
}
