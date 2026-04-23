import { StyleSheet, View } from "react-native";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

type Props = {
  title: string;
};

/** Route shell placeholder until the feature MVVM stack is implemented. */
export function PlaceholderPage({ title }: Props) {
  const { spacing } = useTheme();

  return (
    <Screen scroll>
      <View style={[styles.stack, { marginTop: spacing["2xl"] }]}>
        <AppText variant="title">{title}</AppText>
        <AppText variant="body" color="onSurfaceVariant">
          Screen not built yet — placeholder (Phase 2 layout).
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 8 },
});
