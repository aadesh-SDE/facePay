import axios from "axios";
import { store, persistor } from "@/app/store";
import { clearSession } from "@/features/auth/state/authSlice";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (typeof window !== "undefined" ? "http://localhost:3000" : "/api"),
  timeout: 15_000,
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
      void persistor.flush().finally(() => {
        window.location.href = "/login";
      });
    }
    return Promise.reject(error);
  },
);

export default api;
