import { useCallback, useState } from "react";
import { RefreshControl, StyleSheet, View } from "react-native";
import { useNavigation, type NavigationProp, type ParamListBase } from "@react-navigation/native";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { useAppDispatch } from "@/app/hooks";
import { useHomeViewModel } from "@/features/home/viewModel/useHomeViewModel";
import { resetSend } from "@/features/send/state/sendSlice";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Card } from "@/shared/components/Card";
import { Screen } from "@/shared/components/Screen";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { useTheme } from "@/shared/theme";

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { user, balance, recentTransactions, loading, error, refresh } =
    useHomeViewModel();
  const { spacing, colors, radii } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <Screen
      scroll
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
      contentContainerStyle={{ paddingTop: spacing.lg }}
    >
      <View style={{ gap: spacing.base }}>
        <AppText variant="headline">Hello, {firstName}</AppText>
        <AppText variant="body" color="onSurfaceVariant">
          Your wallet and recent activity.
        </AppText>

        <Card elevated>
          <AppText variant="label" color="onSurfaceVariant">
            Demo balance
          </AppText>
          {loading && !refreshing ? (
            <AppText variant="title" style={{ marginTop: spacing.sm }}>
              …
            </AppText>
          ) : (
            <AppText variant="headline" color="primary" style={{ marginTop: spacing.xs }}>
              {formatCurrency(balance)}
            </AppText>
          )}
          {error ? (
            <AppText variant="caption" color="error" style={{ marginTop: spacing.sm }}>
              {error}
            </AppText>
          ) : null}
        </Card>

        <AppText variant="title">Recent</AppText>
        {recentTransactions.length === 0 && !loading ? (
          <AppText variant="bodySmall" color="onSurfaceVariant">
            No transactions yet.
          </AppText>
        ) : (
          <View style={{ gap: spacing.sm }}>
            {recentTransactions.map((t) => (
              <View
                key={t.id}
                style={[
                  styles.row,
                  {
                    borderColor: colors.outlineVariant,
                    borderRadius: radii.md,
                    padding: spacing.md,
                    backgroundColor: colors.surfaceContainerLowest,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="label">{t.title}</AppText>
                  <AppText variant="caption" color="onSurfaceVariant">
                    {t.subtitle}
                  </AppText>
                </View>
                <AppText
                  variant="label"
                  color={t.direction === "sent" ? "error" : "primary"}
                >
                  {t.direction === "sent" ? "-" : "+"}
                  {formatCurrency(Math.abs(t.amount))}
                </AppText>
              </View>
            ))}
          </View>
        )}

        <AppButton
          title="Send money"
          onPress={() => {
            dispatch(resetSend());
            navigateRootStack(navigation, "SelectRecipient");
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
});
