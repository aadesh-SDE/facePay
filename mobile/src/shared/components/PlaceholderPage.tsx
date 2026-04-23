import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
};

/** Route shell placeholder until the feature MVVM stack is implemented. */
export function PlaceholderPage({ title }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Screen not built yet (Phase 1 skeleton).</Text>
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
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: "#64748b",
  },
});
