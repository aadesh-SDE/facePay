import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { searchRecipientsThunk } from "@/features/send/state/sendThunks";
import { setRecipient } from "@/features/send/state/sendSlice";
import type { Recipient } from "@/features/send/types/send.types";
import { AppText } from "@/shared/components/AppText";
import { AppTextField } from "@/shared/components/AppTextField";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

export function SelectRecipientScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();
  const { searchResults, searchLoading, searchError } = useAppSelector((s) => s.send);
  const { spacing, colors, radii } = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      void dispatch(searchRecipientsThunk(query));
    }, 350);
    return () => clearTimeout(id);
  }, [dispatch, query]);

  const onPick = (r: Recipient) => {
    dispatch(setRecipient(r));
    navigateRootStack(navigation, "EnterAmount");
  };

  return (
    <Screen scroll={false} contentContainerStyle={{ flex: 1, paddingTop: spacing.lg }}>
      <View style={{ flex: 1, gap: spacing.base }}>
        <AppText variant="headline">Send</AppText>
        <AppText variant="bodySmall" color="onSurfaceVariant">
          Search by name or mobile.
        </AppText>
        <AppTextField
          label="Search"
          value={query}
          onChangeText={setQuery}
          placeholder="Start typing…"
          autoCapitalize="none"
        />
        {searchError ? (
          <AppText variant="caption" color="error">
            {searchError}
          </AppText>
        ) : null}
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            searchLoading ? (
              <AppText variant="bodySmall" color="onSurfaceVariant">
                Searching…
              </AppText>
            ) : (
              <AppText variant="bodySmall" color="onSurfaceVariant">
                No matches yet.
              </AppText>
            )
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onPick(item)}
              style={({ pressed }) => [
                styles.row,
                {
                  borderRadius: radii.md,
                  borderColor: colors.outlineVariant,
                  backgroundColor: colors.surfaceContainerLowest,
                  opacity: pressed ? 0.85 : 1,
                  marginBottom: spacing.sm,
                  padding: spacing.md,
                },
              ]}
            >
              <AppText variant="label">{item.name}</AppText>
              <AppText variant="caption" color="onSurfaceVariant">
                {item.mobile}
              </AppText>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
  },
});
