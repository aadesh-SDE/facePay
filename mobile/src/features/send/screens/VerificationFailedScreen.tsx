import { View } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import type { RootStackParamList } from "@/app/navigation/types";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

type Route = RouteProp<RootStackParamList, "VerificationFailed">;

export function VerificationFailedScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<Route>();
  const { spacing } = useTheme();
  const message = route.params?.message ?? "Verification or transfer failed.";

  return (
    <Screen scroll contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.base }}>
      <AppText variant="headline" color="error">
        Could not complete
      </AppText>
      <AppText variant="body">{message}</AppText>
      <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
        <AppButton
          title="Back to review"
          onPress={() => navigateRootStack(navigation, "ReviewPayment")}
        />
        <AppButton
          title="Start over"
          variant="outline"
          onPress={() => navigateRootStack(navigation, "SelectRecipient")}
        />
      </View>
    </Screen>
  );
}
