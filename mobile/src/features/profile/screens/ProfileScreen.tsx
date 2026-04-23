import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation, type NavigationProp, type ParamListBase } from "@react-navigation/native";
import { useProfileViewModel } from "@/features/profile/viewModel/useProfileViewModel";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Card } from "@/shared/components/Card";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

export function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { user, profileData, securityHealth, loading, error, logout } =
    useProfileViewModel();
  const { spacing, colors, radii } = useTheme();

  return (
    <Screen scroll>
      <View style={{ gap: spacing.base, marginTop: spacing.lg }}>
        <AppText variant="headline">Profile</AppText>

        {error ? (
          <AppText variant="bodySmall" color="error">
            {error}
          </AppText>
        ) : null}

        <Card elevated>
          <AppText variant="title">{user?.name ?? "User"}</AppText>
          <AppText variant="body" color="onSurfaceVariant">
            {profileData?.mobile ?? user?.mobile ?? ""}
          </AppText>
          <AppText variant="bodySmall" color="onSurfaceVariant" style={{ marginTop: 4 }}>
            {profileData?.email ?? user?.email ?? ""}
          </AppText>
          {profileData?.joinedDate ? (
            <AppText variant="caption" color="outline" style={{ marginTop: spacing.sm }}>
              Joined {profileData.joinedDate}
            </AppText>
          ) : null}
          {loading ? (
            <AppText variant="caption" style={{ marginTop: spacing.sm }}>
              Loading…
            </AppText>
          ) : null}
        </Card>

        <Card elevated>
          <AppText variant="label" color="onSurfaceVariant">
            Security score
          </AppText>
          <AppText variant="headline" color="primary" style={{ marginTop: spacing.xs }}>
            {securityHealth.score}
          </AppText>
          <AppText variant="caption" color="onSurfaceVariant" style={{ marginTop: spacing.sm }}>
            Face: {securityHealth.faceRegistered ? "on" : "off"} · Email verified:{" "}
            {securityHealth.emailVerified ? "yes" : "no"}
          </AppText>
        </Card>

        <Pressable
          style={({ pressed }) => [
            styles.row,
            {
              borderRadius: radii.lg,
              backgroundColor: colors.surfaceContainerLowest,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
          onPress={() => navigateRootStack(navigation, "RegisterFace")}
        >
          <AppText variant="body">Face ID settings</AppText>
        </Pressable>

        <AppButton
          title="Log out"
          variant="outline"
          onPress={() => void logout()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
