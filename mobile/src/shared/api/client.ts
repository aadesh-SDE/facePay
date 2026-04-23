import axios from "axios";
import { getApiBaseUrl } from "@/shared/config/env";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  // TODO: attach Bearer token from secure storage when auth is wired.
  return config;
});
