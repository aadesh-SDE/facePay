package com.facepay.android.feature.auth.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.facepay.android.core.session.SessionRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SessionViewModel
    @Inject
    constructor(
        private val sessionRepository: SessionRepository,
    ) : ViewModel() {
        val sessionState = sessionRepository.sessionState

        init {
            viewModelScope.launch {
                sessionRepository.bootstrap()
            }
        }

        fun logout() {
            viewModelScope.launch {
                sessionRepository.logout()
            }
        }

        fun retryBootstrap() {
            viewModelScope.launch {
                sessionRepository.bootstrap()
            }
        }
    }
