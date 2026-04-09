import { View, Text, TextInput, type TextInputProps } from "react-native";
import { useTheme } from "@/lib/theme/context";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 6 }}>
      {label && (
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: "500",
            fontFamily: "Onest",
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          {
            backgroundColor: colors.bgSecondary,
            borderWidth: 1,
            borderColor: error ? "#DC6B6B" : colors.border,
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 14,
            fontSize: 16,
            color: colors.textPrimary,
            fontFamily: "Onest",
          },
          style,
        ]}
        {...props}
      />
      {error && (
        <Text
          style={{ color: "#DC6B6B", fontSize: 13, fontFamily: "Onest" }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
