import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/context";
import { useTheme } from "@/lib/theme/context";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { colors, colorScheme, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={{ padding: 20, gap: 24 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            fontFamily: "InriaSerif-Bold",
            color: colors.textPrimary,
          }}
        >
          Settings
        </Text>

        <Card>
          <View style={{ gap: 16 }}>
            <View style={{ gap: 4 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  fontFamily: "Onest",
                }}
              >
                Signed in as
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: colors.textPrimary,
                  fontFamily: "Onest",
                }}
              >
                {user?.email}
              </Text>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
              }}
            />

            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.textMuted,
                  fontFamily: "Onest",
                }}
              >
                Appearance
              </Text>
              <Button variant="ghost" fullWidth onPress={toggleTheme}>
                {colorScheme === "light"
                  ? "Switch to dark mode"
                  : "Switch to light mode"}
              </Button>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
              }}
            />

            <Button variant="danger" fullWidth onPress={signOut}>
              Sign out
            </Button>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
