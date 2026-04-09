import { View, type ViewProps } from "react-native";
import { useTheme } from "@/lib/theme/context";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  accentColor?: string;
}

export function Card({ children, accentColor, style, ...props }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: colors.bgCard,
          borderRadius: 12,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          borderLeftWidth: 3,
          borderLeftColor: accentColor ?? colors.cardAccent,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
