import type { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useTheme } from "@/shared/theme";

type Props = {
  children: ReactNode;
  /** When true, content scrolls; otherwise fills with a column `View`. */
  scroll?: boolean;
  edges?: Edge[];
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  scroll = false,
  edges = ["top", "bottom"],
  contentContainerStyle,
  style,
}: Props) {
  const { colors, spacing } = useTheme();

  if (scroll) {
    return (
      <SafeAreaView
        edges={edges}
        style={[styles.flex, { backgroundColor: colors.background }, style]}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: spacing.base, paddingBottom: spacing.xl },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.flex, { backgroundColor: colors.background }, style]}
    >
      <View
        style={[
          styles.flex,
          {
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.base,
          },
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
