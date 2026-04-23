import axios from "axios";

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const timedOut =
      err.code === "ECONNABORTED" ||
      (typeof err.message === "string" &&
        err.message.toLowerCase().includes("timeout"));
    if (timedOut) {
      return "The server took too long to respond. Try again (cold starts on free hosts can take a minute).";
    }
    if (
      !err.response &&
      (err.code === "ERR_NETWORK" || err.message === "Network Error")
    ) {
      return "Cannot reach API. On a device, localhost is the phone — set EXPO_PUBLIC_API_BASE_URL to your PC's LAN IP and allow CORS for your Expo origin.";
    }
    const data = err.response?.data as
      | { message?: string; code?: string }
      | undefined;
    if (data?.message && typeof data.message === "string") return data.message;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
