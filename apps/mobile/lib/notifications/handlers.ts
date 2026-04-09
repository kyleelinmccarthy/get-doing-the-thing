import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export function setupNotificationHandlers() {
  // Handle notification tap when app is in background/killed
  const subscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as {
        thingId?: string;
      };

      if (data?.thingId) {
        router.push(`/(app)/things/${data.thingId}`);
      } else {
        router.push("/(app)/(tabs)/");
      }
    });

  return () => subscription.remove();
}
