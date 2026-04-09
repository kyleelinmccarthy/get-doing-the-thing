import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/theme/context";
import { registerForPushNotifications } from "@/lib/notifications/setup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DISMISSED_KEY = "notification-prompt-dismissed";

export function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem(DISMISSED_KEY).then((val) => {
      if (val !== "true") setVisible(true);
    });
  }, []);

  function dismiss() {
    setVisible(false);
    AsyncStorage.setItem(DISMISSED_KEY, "true");
  }

  async function enable() {
    await registerForPushNotifications();
    dismiss();
  }

  if (!visible) return null;

  return (
    <Card>
      <View style={{ gap: 12 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: colors.textPrimary,
            fontFamily: "Onest",
          }}
        >
          Enable notifications?
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary,
            fontFamily: "Onest",
          }}
        >
          Get nudged when it's time to do the thing.
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Button variant="neutral" fullWidth onPress={enable}>
              Enable
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" fullWidth onPress={dismiss}>
              Not now
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
}
