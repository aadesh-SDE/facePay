import { StyleSheet, TextInput, View } from "react-native";
import { AppText } from "@/shared/components/AppText";
import { useTheme } from "@/shared/theme";

type Props = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
    | "default"
    | "email-address"
    | "phone-pad"
    | "decimal-pad"
    | "numeric";
};

export function AppTextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default",
}: Props) {
  const { colors, radii, spacing, fontFamily, fontSize } = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText
          variant="label"
          color="onSurfaceVariant"
          style={{ marginBottom: spacing.xs }}
        >
          {label}
        </AppText>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.outlineVariant,
            borderRadius: radii.md,
            paddingHorizontal: spacing.base,
            paddingVertical: spacing.md,
            fontSize: fontSize.base,
            fontFamily: fontFamily.regular,
            color: colors.onSurface,
            backgroundColor: colors.surfaceContainerLowest,
          },
        ]}
      />
      {error ? (
        <AppText
          variant="caption"
          color="error"
          style={{ marginTop: spacing.xs }}
        >
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  input: {
    borderWidth: 1,
  },
});
