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
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.facepay.android.BuildConfig

@Composable
fun RootNavHost(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Routes.Auth,
    ) {
        composable(Routes.Auth) {
            AuthPlaceholderScreen(
                apiBaseUrl = BuildConfig.API_BASE_URL,
                onContinueToMain = { navController.navigate(Routes.Main) },
            )
        }
        composable(Routes.Main) {
            MainPlaceholderScreen(
                onSignOut = {
                    navController.popBackStack(Routes.Auth, inclusive = false)
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
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
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
                modifier = Modifier.padding(top = 8.dp),
            )
            Text(
                text = "API: $apiBaseUrl",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 16.dp),
            )
            Button(
                onClick = onContinueToMain,
                modifier = Modifier.padding(top = 24.dp),
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
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "Main (placeholder)",
                style = MaterialTheme.typography.headlineSmall,
            )
            Button(onClick = onSignOut, modifier = Modifier.padding(top = 24.dp)) {
                Text("Back to auth")
            }
        }
    }
}
