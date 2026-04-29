package com.facepay.android.core.session

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class SessionModule {
    @Binds
    @Singleton
    abstract fun sessionRepository(impl: SessionRepositoryImpl): SessionRepository

    @Binds
    @Singleton
    abstract fun unauthorizedNotifier(impl: UnauthorizedNotifierImpl): UnauthorizedNotifier
}
