import webpush from "web-push";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pushSubscriptions } from "@/lib/db/schema";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidContact = process.env.VAPID_CONTACT ?? "mailto:admin@getdoingthething.com";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidContact, vapidPublicKey, vapidPrivateKey);
}

interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

interface StoredSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export async function sendPushNotification(
  subscription: StoredSubscription,
  payload: PushPayload
) {
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };

  try {
    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify(payload)
    );
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode;

    // 410 Gone — subscription expired, remove it
    if (statusCode === 410) {
      await db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.id, subscription.id));
    }

    throw error;
  }
}

export async function sendPushToUser(userId: string, payload: PushPayload) {
  // Send web push notifications
  const webPushPromise = (async () => {
    const subscriptions = await db.query.pushSubscriptions.findMany({
      where: eq(pushSubscriptions.userId, userId),
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) => sendPushNotification(sub, payload))
    );

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0 && failures.length === results.length) {
      console.error(`All web push notifications failed for user ${userId}`);
    }
  })();

  // Send Expo push notifications (for mobile app)
  const { sendExpoPushToUser } = await import("./expo-push");
  const expoPushPromise = sendExpoPushToUser(userId, payload).catch((err) => {
    console.error(`Expo push failed for user ${userId}:`, err);
  });

  await Promise.allSettled([webPushPromise, expoPushPromise]);
}
