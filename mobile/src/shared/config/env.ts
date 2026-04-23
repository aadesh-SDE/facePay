import Constants from "expo-constants";

type Extra = {
  apiBaseUrl?: string;
};

function getExtra(): Extra {
  const e = Constants.expoConfig?.extra as Extra | undefined;
  return e ?? {};
}

/** Base URL for the FacePay API (no trailing slash). */
export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv && fromEnv.length > 0) return fromEnv.replace(/\/$/, "");
  const fromExtra = getExtra().apiBaseUrl;
  if (fromExtra && fromExtra.length > 0) return fromExtra.replace(/\/$/, "");
  return "http://127.0.0.1:3000";
}
