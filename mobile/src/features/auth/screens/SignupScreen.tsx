import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { RootStackParamList } from "@/app/navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SignupScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.sub}>Skeleton screen — flow comes in a later phase.</Text>
      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Back to sign in</Text>
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
  link: {
    color: "#2563eb",
    fontSize: 15,
  },
});
