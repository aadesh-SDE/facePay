package com.facepay.android

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.facepay.android.core.session.SessionUiState
import com.facepay.android.feature.auth.presentation.SessionViewModel
import com.facepay.android.feature.main.presentation.MainHomeScreen
import com.facepay.android.navigation.AuthNavHost
import com.facepay.android.navigation.BootstrapFailedScreen
import com.facepay.android.navigation.SplashScreen

@Composable
fun FacePayApp(sessionViewModel: SessionViewModel = hiltViewModel()) {
    val sessionState by sessionViewModel.sessionState.collectAsStateWithLifecycle()
    when (val s = sessionState) {
        SessionUiState.Bootstrapping -> SplashScreen(Modifier)
        SessionUiState.Unauthenticated -> AuthNavHost(Modifier)
        is SessionUiState.Authenticated ->
            MainHomeScreen(
                user = s.user,
                onLogout = sessionViewModel::logout,
            )
        is SessionUiState.BootstrapFailed ->
            BootstrapFailedScreen(
                reason = s.reason,
                onRetry = sessionViewModel::retryBootstrap,
                onUseAnotherAccount = sessionViewModel::discardLocalSession,
                modifier = Modifier,
            )
    }
}
