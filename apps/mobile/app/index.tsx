import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth/context";
import { useTheme } from "@/lib/theme/context";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.bgPrimary,
        }}
      >
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/" />;
  }

  return <Redirect href="/(auth)/" />;
}
