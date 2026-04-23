import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/state/authSlice";
import { fetchHealth } from "@/features/home/api/homeApi";
import { getApiBaseUrl } from "@/shared/config/env";

export function HomeScreen() {
  const dispatch = useAppDispatch();
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
    <View style={styles.root}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.base}>API: {getApiBaseUrl()}</Text>
      {loading ? (
        <ActivityIndicator style={styles.spinner} />
      ) : error ? (
        <Text style={styles.err}>GET /health — {error}</Text>
      ) : (
        <Text style={styles.ok}>GET /health — {health}</Text>
      )}
      <Pressable style={styles.outline} onPress={() => dispatch(logout())}>
        <Text style={styles.outlineLabel}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  base: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
  },
  spinner: { marginVertical: 16 },
  ok: { fontSize: 14, color: "#0f172a", marginBottom: 24 },
  err: { fontSize: 14, color: "#b91c1c", marginBottom: 24 },
  outline: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  outlineLabel: { fontWeight: "600" },
});
