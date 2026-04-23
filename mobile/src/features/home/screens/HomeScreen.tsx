import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/state/authSlice";
import { fetchHealth } from "@/features/home/api/homeApi";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Card } from "@/shared/components/Card";
import { Screen } from "@/shared/components/Screen";
import { getApiBaseUrl } from "@/shared/config/env";
import { useTheme } from "@/shared/theme";

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const { spacing } = useTheme();
  const [health, setHealth] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchHealth();
        if (!cancelled) {
          setHealth(JSON.stringify(data));
          setError(null);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Request failed");
          setHealth(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen scroll>
      <View style={[styles.stack, { marginTop: spacing.lg }]}>
        <AppText variant="headline">Home</AppText>
        <AppText variant="caption" color="onSurfaceVariant">
          API: {getApiBaseUrl()}
        </AppText>

        <Card elevated>
          <AppText variant="label" color="onSurfaceVariant">
            Smoke test
          </AppText>
          {loading ? (
            <ActivityIndicator style={styles.spinner} />
          ) : error ? (
            <AppText variant="body" color="error" style={styles.bodyGap}>
              GET /health — {error}
            </AppText>
          ) : (
            <AppText variant="bodySmall" color="onSurface" style={styles.bodyGap}>
              GET /health — {health}
            </AppText>
          )}
        </Card>

        <AppButton
          title="Log out"
          onPress={() => dispatch(logout())}
          variant="outline"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  spinner: { marginVertical: 12 },
  bodyGap: { marginTop: 8 },
});
