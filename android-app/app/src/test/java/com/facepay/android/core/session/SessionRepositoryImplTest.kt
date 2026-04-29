package com.facepay.android.core.session

import com.facepay.android.feature.auth.data.remote.AuthApi
import com.facepay.android.feature.auth.data.remote.MeApi
import com.facepay.android.feature.auth.data.remote.dto.MeResponseDto
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.launch
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.advanceTimeBy
import kotlinx.coroutines.test.advanceUntilIdle
import kotlinx.coroutines.test.runTest
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.ResponseBody.Companion.toResponseBody
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

@OptIn(ExperimentalCoroutinesApi::class)
class SessionRepositoryImplTest {
    private val authApi = mockk<AuthApi>(relaxed = true)
    private val meApi = mockk<MeApi>()
    private val secureTokenStore = mockk<SecureTokenStore>()
    private val tokenHolder = TokenHolder()
    private val sessionStateHolder = SessionStateHolder()

    private val sampleMe =
        MeResponseDto(
            id = "u1",
            name = "Test User",
            mobile = "9876543210",
            email = "t@example.com",
            joinedAt = "2024-01-01",
            faceRegistered = false,
            avatar = null,
        )

    @Before
    fun setUp() {
        sessionStateHolder.set(SessionUiState.Bootstrapping)
        tokenHolder.setToken(null)
        every { secureTokenStore.clearToken() } answers { }
        every { secureTokenStore.writeToken(any()) } answers { }
    }

    @Test
    fun `bootstrap with no token is Unauthenticated`() =
        runTest {
            every { secureTokenStore.readToken() } returns null
            val repo = newRepo()
            repo.bootstrap()
            advanceUntilIdle()
            assertEquals(SessionUiState.Unauthenticated, sessionStateHolder.state.value)
            coVerify(exactly = 0) { meApi.getMe() }
        }

    @Test
    fun `bootstrap success sets Authenticated`() =
        runTest {
            every { secureTokenStore.readToken() } returns "jwt"
            coEvery { meApi.getMe() } returns sampleMe
            val repo = newRepo()
            repo.bootstrap()
            advanceUntilIdle()
            val s = sessionStateHolder.state.value
            assertTrue(s is SessionUiState.Authenticated)
            assertEquals("u1", (s as SessionUiState.Authenticated).user.id)
            assertEquals("jwt", tokenHolder.peek())
        }

    @Test
    fun `bootstrap 401 clears token and is Unauthenticated`() =
        runTest {
            every { secureTokenStore.readToken() } returns "jwt"
            coEvery { meApi.getMe() } throws httpException(401)
            val repo = newRepo()
            repo.bootstrap()
            advanceUntilIdle()
            assertEquals(SessionUiState.Unauthenticated, sessionStateHolder.state.value)
            verify { secureTokenStore.clearToken() }
            assertEquals(null, tokenHolder.peek())
        }

    @Test
    fun `bootstrap 503 then success after retry`() =
        runTest {
            val ioDispatcher = StandardTestDispatcher(testScheduler)
            every { secureTokenStore.readToken() } returns "jwt"
            var calls = 0
            coEvery { meApi.getMe() } coAnswers {
                calls++
                if (calls == 1) {
                    throw httpException(503)
                }
                sampleMe
            }
            val repo = newRepo(ioDispatcher)
            val job = launch { repo.bootstrap() }
            advanceUntilIdle()
            advanceTimeBy(1200)
            advanceUntilIdle()
            job.join()
            assertTrue(sessionStateHolder.state.value is SessionUiState.Authenticated)
        }

    @Test
    fun `bootstrap repeated IOException is BootstrapFailed and keeps token on disk`() =
        runTest {
            val ioDispatcher = StandardTestDispatcher(testScheduler)
            every { secureTokenStore.readToken() } returns "jwt"
            coEvery { meApi.getMe() } throws IOException("net")
            val repo = newRepo(ioDispatcher)
            val job = launch { repo.bootstrap() }
            advanceUntilIdle()
            advanceTimeBy(4000)
            advanceUntilIdle()
            job.join()
            val s = sessionStateHolder.state.value
            assertTrue(s is SessionUiState.BootstrapFailed)
            assertEquals(BootstrapFailureReason.Network, (s as SessionUiState.BootstrapFailed).reason)
            verify(exactly = 0) { secureTokenStore.clearToken() }
            assertEquals("jwt", tokenHolder.peek())
        }

    @Test
    fun `discardLocalSession clears store`() =
        runTest {
            val repo = newRepo()
            repo.discardLocalSession()
            advanceUntilIdle()
            verify { secureTokenStore.clearToken() }
            assertEquals(SessionUiState.Unauthenticated, sessionStateHolder.state.value)
        }

    private fun newRepo(io: CoroutineDispatcher = Dispatchers.Unconfined) =
        SessionRepositoryImpl(
            authApi = authApi,
            meApi = meApi,
            secureTokenStore = secureTokenStore,
            tokenHolder = tokenHolder,
            sessionStateHolder = sessionStateHolder,
            ioDispatcher = io,
        )

    private fun httpException(code: Int): HttpException {
        val body = "{}".toResponseBody("application/json".toMediaType())
        return HttpException(Response.error<Any>(code, body))
    }
}
