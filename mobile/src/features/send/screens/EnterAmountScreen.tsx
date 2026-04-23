import { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { setAmount, setNote, setStatus } from "@/features/send/state/sendSlice";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { AppTextField } from "@/shared/components/AppTextField";
import { Screen } from "@/shared/components/Screen";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { useTheme } from "@/shared/theme";

export function EnterAmountScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();
  const { recipient, note } = useAppSelector((s) => s.send);
  const balance = useAppSelector((s) => s.wallet.balance);
  const { spacing } = useTheme();
  const [amountText, setAmountText] = useState("");
  const [noteText, setNoteText] = useState(note);

  const onContinue = () => {
    const n = Number.parseFloat(amountText.replace(/,/g, ""));
    if (!Number.isFinite(n) || n <= 0) return;
    dispatch(setAmount(n));
    dispatch(setNote(noteText.trim()));
    dispatch(setStatus("reviewing"));
    navigateRootStack(navigation, "ReviewPayment");
  };

  if (!recipient) {
    return (
      <Screen scroll>
        <AppText variant="body">No recipient selected.</AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.base }}>
      <AppText variant="headline">Amount</AppText>
      <AppText variant="bodySmall" color="onSurfaceVariant">
        To {recipient.name} · {recipient.mobile}
      </AppText>
      <AppText variant="caption" color="onSurfaceVariant">
        Available {formatCurrency(balance)}
      </AppText>
      <AppTextField
        label="Amount (INR)"
        value={amountText}
        onChangeText={setAmountText}
        placeholder="0.00"
        keyboardType="decimal-pad"
      />
      <AppTextField
        label="Note (optional)"
        value={noteText}
        onChangeText={setNoteText}
        placeholder="Lunch, rent…"
      />
      <AppButton title="Review" onPress={onContinue} />
    </Screen>
  );
}
