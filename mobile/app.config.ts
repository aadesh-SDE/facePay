import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const name = config.name ?? "FacePay";
  const slug = config.slug ?? "facepay-mobile";
  return {
    ...config,
    name,
    slug,
    extra: {
      ...config.extra,
      apiBaseUrl:
        process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3000",
    },
  };
};
