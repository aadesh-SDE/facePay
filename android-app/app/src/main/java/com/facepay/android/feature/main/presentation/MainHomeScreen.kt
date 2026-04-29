package com.facepay.android.feature.main.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.facepay.android.core.designsystem.components.scaffold.FpAppScaffold
import com.facepay.android.core.designsystem.theme.FpSpacing
import com.facepay.android.feature.auth.domain.model.User

@Composable
fun MainHomeScreen(
    user: User,
    onLogout: () -> Unit,
) {
    val snackbarHostState = remember { SnackbarHostState() }
    FpAppScaffold(
        title = "FacePay",
        snackbarHostState = snackbarHostState,
        actions = {
            TextButton(onClick = onLogout) {
                Text("Log out", color = MaterialTheme.colorScheme.primary)
            }
        },
    ) { padding ->
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(FpSpacing.xxl),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = "Signed in",
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.onBackground,
            )
            Text(
                text = "Hi, ${user.name}",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = FpSpacing.sm),
            )
            Text(
                text = "Home and wallet flows ship in Phase 2.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = FpSpacing.lg),
            )
        }
    }
}
