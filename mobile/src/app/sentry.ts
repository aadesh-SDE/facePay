import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

const dsn =
  (Constants.expoConfig?.extra?.sentryDsn as string | undefined)?.trim() || undefined;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  sendDefaultPii: false,
  tracesSampleRate: 0.15,
  debug: false,
});
