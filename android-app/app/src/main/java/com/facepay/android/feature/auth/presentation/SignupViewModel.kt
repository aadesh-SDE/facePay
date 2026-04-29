package com.facepay.android.feature.auth.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.facepay.android.core.common.AppResult
import com.facepay.android.core.session.SessionRepository
import com.facepay.android.feature.auth.domain.repository.AuthRepository
import com.facepay.android.feature.auth.domain.validation.isValidEmail
import com.facepay.android.feature.auth.domain.validation.isValidMobile
import com.facepay.android.feature.auth.domain.validation.validateName
import com.facepay.android.feature.auth.domain.validation.validatePassword
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SignupUiState(
    val name: String = "",
    val mobile: String = "",
    val email: String = "",
    val password: String = "",
    val fieldErrors: Map<String, String> = emptyMap(),
    val error: String? = null,
    val isLoading: Boolean = false,
)

@HiltViewModel
class SignupViewModel
    @Inject
    constructor(
        private val authRepository: AuthRepository,
        private val sessionRepository: SessionRepository,
    ) : ViewModel() {
        private val _uiState = MutableStateFlow(SignupUiState())
        val uiState: StateFlow<SignupUiState> = _uiState.asStateFlow()

        fun setName(value: String) {
            _uiState.update { it.copy(name = value, fieldErrors = it.fieldErrors - "name", error = null) }
        }

        fun setMobile(value: String) {
            _uiState.update { it.copy(mobile = value, fieldErrors = it.fieldErrors - "mobile", error = null) }
        }

        fun setEmail(value: String) {
            _uiState.update { it.copy(email = value, fieldErrors = it.fieldErrors - "email", error = null) }
        }

        fun setPassword(value: String) {
            _uiState.update { it.copy(password = value, fieldErrors = it.fieldErrors - "password", error = null) }
        }

        fun clearError() {
            _uiState.update { it.copy(error = null) }
        }

        private fun validate(): Boolean {
            val errors = mutableMapOf<String, String>()
            validateName(_uiState.value.name)?.let { errors["name"] = it }
            if (!isValidMobile(_uiState.value.mobile)) {
                errors["mobile"] = "Enter a valid 10-digit mobile number"
            }
            if (!isValidEmail(_uiState.value.email)) {
                errors["email"] = "Enter a valid email address"
            }
            validatePassword(_uiState.value.password)?.let { errors["password"] = it }
            _uiState.update { it.copy(fieldErrors = errors) }
            return errors.isEmpty()
        }

        fun signup() {
            if (!validate()) return
            val s = _uiState.value
            viewModelScope.launch {
                _uiState.update { it.copy(isLoading = true, error = null) }
                when (val result = authRepository.signup(s.name, s.mobile, s.email, s.password)) {
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
