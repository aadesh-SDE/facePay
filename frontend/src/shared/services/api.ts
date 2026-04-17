import axios from "axios";
import { store, persistor } from "@/app/store";
import { resetSessionClientState } from "@/app/sessionCleanup";
import { clearSession } from "@/features/auth/state/authSlice";

/** Render free tier cold starts often exceed 15s; mobile users hit that first. */
const DEFAULT_TIMEOUT_MS = 60_000;

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined" ? "http://localhost:3000" : "/api"),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fp_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fp_token");
      store.dispatch(clearSession());
      resetSessionClientState(store.dispatch);
      void persistor.flush().finally(() => {
        window.location.href = "/login";
      });
    }
    return Promise.reject(error);
  },
);

export default api;
