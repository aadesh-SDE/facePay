import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppDispatch } from "@/app/hooks";
import type { RootStackParamList } from "@/app/navigation/types";
import { setAuthenticated } from "@/features/auth/state/authSlice";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LoginScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>FacePay</Text>
      <Text style={styles.sub}>Sign in (skeleton)</Text>
      <Pressable
        style={styles.primary}
        onPress={() => dispatch(setAuthenticated(true))}
      >
        <Text style={styles.primaryLabel}>Dev: continue as signed in</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.link}>Go to sign up</Text>
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
  sub: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 24,
  },
  primary: {
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryLabel: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  link: {
    color: "#2563eb",
    textAlign: "center",
    fontSize: 15,
  },
});
