package com.facepay.android.core.session

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SecureTokenStore
    @Inject
    constructor(
        @ApplicationContext context: Context,
    ) {
        private val prefs: SharedPreferences by lazy {
            val masterKey =
                MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build()
            EncryptedSharedPreferences.create(
                context,
                PREFS_NAME,
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
            )
        }

        fun readToken(): String? = prefs.getString(KEY_TOKEN, null)

        fun writeToken(token: String) {
            prefs.edit().putString(KEY_TOKEN, token).apply()
        }

        fun clearToken() {
            prefs.edit().remove(KEY_TOKEN).apply()
        }

        private companion object {
            const val PREFS_NAME = "facepay_secure_prefs"
            const val KEY_TOKEN = "access_token"
        }
    }
