import axios from "axios";
import { getApiBaseUrl } from "@/shared/config/env";
import { deleteAuthToken, getAuthToken } from "@/shared/lib/authTokenStorage";

const DEFAULT_TIMEOUT_MS = 60_000;

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: DEFAULT_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await deleteAuthToken();
      const { store } = await import("@/app/store");
      const { clearSession } = await import("@/features/auth/state/authSlice");
      const { resetHomeData } = await import("@/features/home/state/homeSlice");
      const { resetWallet } = await import("@/features/wallet/state/walletSlice");
      store.dispatch(clearSession());
      store.dispatch(resetHomeData());
      store.dispatch(resetWallet());
    }
    return Promise.reject(error);
  },
);
