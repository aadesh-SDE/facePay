package com.facepay.android.core.session

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SessionStateHolder
    @Inject
    constructor() {
        private val _state = MutableStateFlow<SessionUiState>(SessionUiState.Bootstrapping)
        val state: StateFlow<SessionUiState> = _state.asStateFlow()

        fun set(value: SessionUiState) {
            _state.value = value
        }
    }
