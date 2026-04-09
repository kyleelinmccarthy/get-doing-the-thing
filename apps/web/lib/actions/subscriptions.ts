"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { pushSubscriptions } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-utils";

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function savePushSubscription(subscription: PushSubscriptionData) {
  const session = await requireAuth();

  // Upsert — avoid duplicate subscriptions for same endpoint
  const existing = await db.query.pushSubscriptions.findFirst({
    where: and(
      eq(pushSubscriptions.userId, session.user.id),
      eq(pushSubscriptions.endpoint, subscription.endpoint)
    ),
  });

  if (existing) {
    await db
      .update(pushSubscriptions)
      .set({
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      })
      .where(eq(pushSubscriptions.id, existing.id));
    return;
  }

  await db.insert(pushSubscriptions).values({
    userId: session.user.id,
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth,
  });
}

export async function removePushSubscription(endpoint: string) {
  const session = await requireAuth();

  await db
    .delete(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.userId, session.user.id),
        eq(pushSubscriptions.endpoint, endpoint)
      )
    );
}
