import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/theme/context";
import { requestMagicLink } from "@/lib/api/auth";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { colors } = useTheme();

  async function handleSignIn() {
    if (!email.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      await requestMagicLink(email.trim());
      router.push({ pathname: "/(auth)/verify", params: { email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}
      >
        <View style={{ gap: 32, maxWidth: 400, alignSelf: "center", width: "100%" }}>
          <View style={{ alignItems: "center", gap: 8 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                fontFamily: "InriaSerif-Bold",
                color: colors.textPrimary,
              }}
            >
              Doing The Thing
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.textMuted,
                fontFamily: "Onest",
              }}
            >
              Sign in to get started.
            </Text>
          </View>

          <Card>
            <View style={{ gap: 16 }}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={error}
              />
              <Button
                variant="neutral"
                fullWidth
                onPress={handleSignIn}
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? "Sending..." : "Send magic link"}
              </Button>
            </View>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
