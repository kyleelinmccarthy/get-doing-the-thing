import { useEffect } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/context";
import { useTheme } from "@/lib/theme/context";
import { verifyCallback } from "@/lib/api/auth";

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { signIn } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      const parsed = Linking.parse(url);

      if (
        parsed.path === "auth/callback" &&
        parsed.queryParams?.token &&
        parsed.queryParams?.email
      ) {
        try {
          const result = await verifyCallback(
            parsed.queryParams.token as string,
            parsed.queryParams.email as string
          );
          await signIn(result.token, result.user);
          router.replace("/(app)/(tabs)/");
        } catch (error) {
          console.error("Auth callback failed:", error);
          router.replace("/(auth)/");
        }
      }
    });

    return () => subscription.remove();
  }, [signIn]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <Card>
          <View style={{ alignItems: "center", gap: 16, paddingVertical: 12 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: colors.textPrimary,
                fontFamily: "Onest",
              }}
            >
              Check your email
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: colors.textSecondary,
                textAlign: "center",
                fontFamily: "Onest",
              }}
            >
              We sent a sign-in link to{"\n"}
              <Text style={{ fontWeight: "600" }}>{email}</Text>
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textMuted,
                textAlign: "center",
                fontFamily: "Onest",
              }}
            >
              Tap the link in the email to sign in.
            </Text>
            <Button
              variant="ghost"
              onPress={() => router.back()}
            >
              Use a different email
            </Button>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
