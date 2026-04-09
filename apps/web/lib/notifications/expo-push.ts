import { Expo, type ExpoPushMessage } from "expo-server-sdk";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { expoPushTokens } from "@/lib/db/schema";

const expo = new Expo();

interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendExpoPushToUser(
  userId: string,
  payload: PushPayload
) {
  const tokens = await db.query.expoPushTokens.findMany({
    where: eq(expoPushTokens.userId, userId),
  });

  if (tokens.length === 0) return;

  const messages: ExpoPushMessage[] = tokens
    .filter((t) => Expo.isExpoPushToken(t.token))
    .map((t) => ({
      to: t.token,
      sound: "default" as const,
      title: payload.title,
      body: payload.body,
      data: payload.data,
    }));

  if (messages.length === 0) return;

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);

      // Clean up invalid tokens
      for (let i = 0; i < receipts.length; i++) {
        const receipt = receipts[i];
        if (receipt.status === "error" && receipt.details?.error === "DeviceNotRegistered") {
          const token = messages[i]?.to;
          if (typeof token === "string") {
            await db
              .delete(expoPushTokens)
              .where(eq(expoPushTokens.token, token));
          }
        }
      }
    } catch (error) {
      console.error("[ExpoPush] Failed to send chunk:", error);
    }
  }
}
