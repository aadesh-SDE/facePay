import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { setStatus } from "@/features/send/state/sendSlice";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Card } from "@/shared/components/Card";
import { Screen } from "@/shared/components/Screen";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { useTheme } from "@/shared/theme";

export function ReviewPaymentScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();
  const { recipient, amount, note } = useAppSelector((s) => s.send);
  const { spacing } = useTheme();

  const onConfirm = () => {
    dispatch(setStatus("verifying"));
    navigateRootStack(navigation, "FaceVerification");
  };

  if (!recipient || !amount) {
    return (
      <Screen scroll>
        <AppText variant="body">Nothing to review.</AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.base }}>
      <AppText variant="headline">Review</AppText>
      <Card elevated>
        <AppText variant="label" color="onSurfaceVariant">
          Recipient
        </AppText>
        <AppText variant="title" style={{ marginTop: spacing.xs }}>
          {recipient.name}
        </AppText>
        <AppText variant="caption" color="onSurfaceVariant">
          {recipient.mobile}
        </AppText>
      </Card>
      <Card elevated>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText variant="body">Amount</AppText>
          <AppText variant="title">{formatCurrency(amount)}</AppText>
        </View>
        {note ? (
          <AppText variant="caption" color="onSurfaceVariant" style={{ marginTop: spacing.sm }}>
            Note: {note}
          </AppText>
        ) : null}
      </Card>
      <AppButton title="Confirm with biometrics" onPress={onConfirm} />
    </Screen>
  );
}
