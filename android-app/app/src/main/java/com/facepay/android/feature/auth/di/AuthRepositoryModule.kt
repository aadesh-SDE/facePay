package com.facepay.android.feature.auth.di

import com.facepay.android.feature.auth.data.repository.AuthRepositoryImpl
import com.facepay.android.feature.auth.domain.repository.AuthRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class AuthRepositoryModule {
    @Binds
    @Singleton
    abstract fun authRepository(impl: AuthRepositoryImpl): AuthRepository
}
