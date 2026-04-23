import { useCallback, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from "react-native";
import { useHistoryViewModel } from "@/features/history/viewModel/useHistoryViewModel";
import type { TransactionFilter } from "@/features/history/types/history.types";
import type { Transaction } from "@/features/home/types/home.types";
import { AppText } from "@/shared/components/AppText";
import { AppTextField } from "@/shared/components/AppTextField";
import { Screen } from "@/shared/components/Screen";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { useTheme } from "@/shared/theme";

const FILTERS: TransactionFilter[] = ["all", "sent", "received"];

export function HistoryScreen() {
  const {
    transactions,
    filter,
    searchQuery,
    loading,
    error,
    setFilter,
    setSearchQuery,
    refresh,
  } = useHistoryViewModel();
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

  const renderItem = useCallback(
    ({ item: t }: { item: Transaction }) => (
      <View
        style={[
          styles.row,
          {
            borderColor: colors.outlineVariant,
            borderRadius: radii.md,
            padding: spacing.md,
            backgroundColor: colors.surfaceContainerLowest,
            marginBottom: spacing.sm,
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
    ),
    [colors.outlineVariant, colors.surfaceContainerLowest, radii.md, spacing.md, spacing.sm],
  );

  return (
    <Screen
      scroll={false}
      contentContainerStyle={{ flex: 1, paddingTop: spacing.lg }}
    >
      <View style={{ flex: 1, gap: spacing.base }}>
        <AppText variant="headline">History</AppText>
        {error ? (
          <AppText variant="bodySmall" color="error">
            {error}
          </AppText>
        ) : null}

        <AppTextField
          label="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Name or detail"
          autoCapitalize="none"
        />

        <View style={styles.chips}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.chip,
                {
                  borderRadius: radii.full,
                  borderColor: filter === f ? colors.primary : colors.outlineVariant,
                  backgroundColor:
                    filter === f ? colors.primaryContainer : colors.surfaceContainerLowest,
                },
              ]}
            >
              <AppText
                variant="caption"
                color={filter === f ? "onPrimaryContainer" : "onSurfaceVariant"}
                style={{ textTransform: "capitalize" }}
              >
                {f}
              </AppText>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(t) => t.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
          }
          ListEmptyComponent={
            !loading ? (
              <AppText variant="bodySmall" color="onSurfaceVariant">
                No transactions match.
              </AppText>
            ) : null
          }
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
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
});
