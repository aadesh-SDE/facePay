import { View } from "react-native";
import {
  useNavigation,
  useRoute,
  type NavigationProp,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { RootStackParamList } from "@/app/navigation/types";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { resetSend } from "@/features/send/state/sendSlice";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { useTheme } from "@/shared/theme";

type Route = RouteProp<RootStackParamList, "SuccessReceipt">;

export function SuccessReceiptScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<Route>();
  const dispatch = useAppDispatch();
  const { amount, recipient, transactionId: txFromStore } = useAppSelector((s) => s.send);
  const { spacing } = useTheme();
  const txId = route.params?.transactionId ?? txFromStore ?? undefined;

  const onDone = () => {
    dispatch(resetSend());
    navigateRootStack(navigation, "MainTabs");
  };

  return (
    <Screen scroll contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.base }}>
      <AppText variant="headline" color="primary">
        Sent
      </AppText>
      <AppText variant="body">
        {formatCurrency(amount)} to {recipient?.name ?? "recipient"}
      </AppText>
      {txId ? (
        <AppText variant="caption" color="onSurfaceVariant">
          Reference: {txId}
        </AppText>
      ) : null}
      <View style={{ marginTop: spacing.lg }}>
        <AppButton title="Done" onPress={onDone} />
      </View>
    </Screen>
  );
}
