package com.facepay.android.core.session

/** Invoked from OkHttp when a protected call returns HTTP 401. */
fun interface UnauthorizedNotifier {
    fun onUnauthorized()
}
