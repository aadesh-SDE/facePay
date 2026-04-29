package com.facepay.android.feature.auth.presentation.screen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.facepay.android.core.designsystem.components.button.FpPrimaryButton
import com.facepay.android.core.designsystem.components.input.FpTextField
import com.facepay.android.core.designsystem.components.scaffold.FpAppScaffold
import com.facepay.android.core.designsystem.theme.FpSpacing
import com.facepay.android.feature.auth.presentation.LoginViewModel

@Composable
fun LoginScreen(
    onNavigateToSignup: () -> Unit,
    viewModel: LoginViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    var passwordVisible by remember { mutableStateOf(false) }

    LaunchedEffect(uiState.error) {
        val msg = uiState.error ?: return@LaunchedEffect
        snackbarHostState.showSnackbar(msg)
        viewModel.clearError()
    }

    FpAppScaffold(
        title = "FacePay",
        snackbarHostState = snackbarHostState,
    ) { padding ->
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(horizontal = FpSpacing.xxl)
                    .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top,
        ) {
            Spacer(modifier = Modifier.height(FpSpacing.xxxl))
            Surface(
                modifier = Modifier.padding(bottom = FpSpacing.lg),
                shape = MaterialTheme.shapes.extraLarge,
                color = MaterialTheme.colorScheme.primaryContainer,
                tonalElevation = 2.dp,
            ) {
                Icon(
                    imageVector = Icons.Filled.Face,
                    contentDescription = null,
                    modifier =
                        Modifier
                            .padding(FpSpacing.lg)
                            .height(48.dp),
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Text(
                text = "Welcome Back",
                style = MaterialTheme.typography.headlineSmall,
                color = MaterialTheme.colorScheme.onBackground,
            )
            Text(
                text = "Login to your FacePay account",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = FpSpacing.sm, bottom = FpSpacing.xxl),
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = "+91",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(end = FpSpacing.sm),
                )
                FpTextField(
                    value = uiState.mobile,
                    onValueChange = viewModel::setMobile,
                    label = "Mobile number",
                    modifier = Modifier.weight(1f),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                )
            }
            Spacer(modifier = Modifier.height(FpSpacing.lg))
            FpTextField(
                value = uiState.password,
                onValueChange = viewModel::setPassword,
                label = "Password",
                visualTransformation =
                    if (passwordVisible) {
                        VisualTransformation.None
                    } else {
                        PasswordVisualTransformation()
                    },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                trailingIcon = {
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            imageVector =
                                if (passwordVisible) {
                                    Icons.Filled.VisibilityOff
                                } else {
                                    Icons.Filled.Visibility
                                },
                            contentDescription = if (passwordVisible) "Hide password" else "Show password",
                        )
                    }
                },
            )
            Spacer(modifier = Modifier.height(FpSpacing.xxl))
            FpPrimaryButton(
                text = if (uiState.isLoading) "Signing in…" else "Sign in",
                onClick = { viewModel.login() },
                enabled = !uiState.isLoading,
            )
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(top = FpSpacing.lg),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = "New to FacePay?",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                TextButton(onClick = onNavigateToSignup) {
                    Text("Create account")
                }
            }
        }
    }
}
