package com.facepay.android.navigation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.facepay.android.R
import com.facepay.android.core.designsystem.components.button.FpPrimaryButton
import com.facepay.android.core.session.BootstrapFailureReason

@Composable
fun BootstrapFailedScreen(
    reason: BootstrapFailureReason,
    onRetry: () -> Unit,
    onUseAnotherAccount: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val message =
        when (reason) {
            BootstrapFailureReason.Network ->
                stringResource(R.string.bootstrap_failed_message_network)
            BootstrapFailureReason.Server ->
                stringResource(R.string.bootstrap_failed_message_server)
        }
    Column(
        modifier =
            modifier
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = stringResource(R.string.bootstrap_failed_title),
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.onBackground,
            textAlign = TextAlign.Center,
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = message,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
        )
        Spacer(modifier = Modifier.height(28.dp))
        FpPrimaryButton(
            text = stringResource(R.string.bootstrap_failed_retry),
            onClick = onRetry,
        )
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedButton(
            onClick = onUseAnotherAccount,
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(52.dp),
            shape = MaterialTheme.shapes.large,
        ) {
            Text(
                text = stringResource(R.string.bootstrap_failed_use_another_account),
                style = MaterialTheme.typography.labelLarge,
            )
        }
    }
}
