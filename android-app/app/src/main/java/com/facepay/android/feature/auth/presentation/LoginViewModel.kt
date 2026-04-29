package com.facepay.android.feature.auth.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.facepay.android.core.common.AppResult
import com.facepay.android.core.session.SessionRepository
import com.facepay.android.feature.auth.domain.repository.AuthRepository
import com.facepay.android.feature.auth.domain.validation.isValidMobile
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LoginUiState(
    val mobile: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
)

@HiltViewModel
class LoginViewModel
    @Inject
    constructor(
        private val authRepository: AuthRepository,
        private val sessionRepository: SessionRepository,
    ) : ViewModel() {
        private val _uiState = MutableStateFlow(LoginUiState())
        val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

        fun setMobile(value: String) {
            _uiState.update { it.copy(mobile = value, error = null) }
        }

        fun setPassword(value: String) {
            _uiState.update { it.copy(password = value, error = null) }
        }

        fun clearError() {
            _uiState.update { it.copy(error = null) }
        }

        fun login() {
            val mobile = _uiState.value.mobile
            val password = _uiState.value.password
            if (!isValidMobile(mobile)) {
                _uiState.update { it.copy(error = "Enter a valid 10-digit mobile number") }
                return
            }
            if (password.isBlank()) {
                _uiState.update { it.copy(error = "Password is required") }
                return
            }
            viewModelScope.launch {
                _uiState.update { it.copy(isLoading = true, error = null) }
                when (val result = authRepository.login(mobile, password)) {
                    is AppResult.Success -> {
                        sessionRepository.persistAuth(result.data)
                        _uiState.update { it.copy(isLoading = false) }
                    }
                    is AppResult.Error -> {
                        _uiState.update {
                            it.copy(isLoading = false, error = result.error.message)
                        }
                    }
                }
            }
        }
    }
