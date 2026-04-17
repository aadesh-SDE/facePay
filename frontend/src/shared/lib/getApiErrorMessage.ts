import axios from "axios";

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const timedOut =
      err.code === "ECONNABORTED" ||
      (typeof err.message === "string" && err.message.toLowerCase().includes("timeout"));
    if (timedOut) {
      return "The server took too long to respond. If the API is on Render’s free tier, the first request after idle can take a minute — try again. Otherwise check your connection.";
    }
    if (!err.response && (err.code === "ERR_NETWORK" || err.message === "Network Error")) {
      return "Cannot reach API. On a phone, localhost is the phone itself — use your PC's LAN IP (e.g. http://192.168.1.x:3000) in frontend/.env as VITE_API_URL, add http://<same-ip>:5173 to backend CORS_ORIGINS, restart both. On the same PC only: run backend on :3000 and open the app at http://localhost:5173.";
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
