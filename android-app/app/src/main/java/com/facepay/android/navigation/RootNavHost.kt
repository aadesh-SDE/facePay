package com.facepay.android.navigation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.facepay.android.BuildConfig
import com.facepay.android.core.designsystem.theme.FpSpacing

@Composable
fun RootNavHost(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Routes.AUTH,
    ) {
        composable(Routes.AUTH) {
            AuthPlaceholderScreen(
                apiBaseUrl = BuildConfig.API_BASE_URL,
                onContinueToMain = { navController.navigate(Routes.MAIN) },
            )
        }
        composable(Routes.MAIN) {
            MainPlaceholderScreen(
                onSignOut = {
                    navController.popBackStack(Routes.AUTH, inclusive = false)
                },
            )
        }
    }
}

@Composable
private fun AuthPlaceholderScreen(
    apiBaseUrl: String,
    onContinueToMain: () -> Unit,
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background,
    ) {
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(FpSpacing.xxl),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "FacePay",
                style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.onBackground,
            )
            Text(
                text = "Auth (placeholder)",
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.padding(top = FpSpacing.sm),
            )
            Text(
                text = "API: $apiBaseUrl",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = FpSpacing.lg),
            )
            Button(
                onClick = onContinueToMain,
                modifier = Modifier.padding(top = FpSpacing.xxl),
            ) {
                Text("Open main shell (placeholder)")
            }
        }
    }
}

@Composable
private fun MainPlaceholderScreen(onSignOut: () -> Unit) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background,
    ) {
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(FpSpacing.xxl),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "Main (placeholder)",
                style = MaterialTheme.typography.headlineSmall,
            )
            Button(onClick = onSignOut, modifier = Modifier.padding(top = FpSpacing.xxl)) {
                Text("Back to auth")
            }
        }
    }
}
