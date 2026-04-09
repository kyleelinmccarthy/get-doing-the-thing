import { Pressable, Text, type PressableProps } from "react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/lib/theme/context";

type ButtonVariant = "success" | "neutral" | "muted" | "ghost" | "danger";

interface ButtonProps extends Omit<PressableProps, "children"> {
  children: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "neutral",
  fullWidth = false,
  disabled,
  onPress,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();

  const variantStyles: Record<
    ButtonVariant,
    { bg: string; text: string; border?: string }
  > = {
    success: { bg: colors.btnDid, text: colors.btnText },
    neutral: { bg: colors.btnDoing, text: colors.btnText },
    muted: { bg: colors.btnCant, text: colors.btnText },
    ghost: { bg: "transparent", text: colors.textSecondary, border: colors.border },
    danger: { bg: "#DC6B6B", text: "#FFFFFF" },
  };

  const style = variantStyles[variant];

  return (
    <Pressable
      onPress={(e) => {
        if (!disabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress?.(e);
        }
      }}
      disabled={disabled}
      style={({ pressed }) => ({
        backgroundColor: style.bg,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        width: fullWidth ? "100%" : undefined,
        borderWidth: style.border ? 1 : 0,
        borderColor: style.border,
      })}
      {...props}
    >
      <Text
        style={{
          color: style.text,
          fontSize: 16,
          fontWeight: "600",
          fontFamily: "Onest",
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
