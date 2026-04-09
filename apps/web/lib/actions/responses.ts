"use server";

import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { things, responses } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-utils";
import {
  respondToNudgeSchema,
  submitCheckinSchema,
  type RespondToNudgeInput,
  type SubmitCheckinInput,
  ResponseType,
} from "@doing-the-thing/shared";

export type NudgeResponse = {
  success: boolean;
  requiresCheckin?: boolean;
  deferralCount?: number;
};

async function verifyThingOwnership(thingId: string, userId: string) {
  const thing = await db.query.things.findFirst({
    where: and(eq(things.id, thingId), eq(things.userId, userId)),
  });

  if (!thing) {
    throw new Error("Thing not found");
  }

  return thing;
}

async function getLastResponse(thingId: string) {
  return db.query.responses.findFirst({
    where: eq(responses.thingId, thingId),
    orderBy: [desc(responses.respondedAt)],
  });
}

export async function respondToNudge(
  input: RespondToNudgeInput
): Promise<NudgeResponse> {
  const session = await requireAuth();
  const validated = respondToNudgeSchema.parse(input);
  const thing = await verifyThingOwnership(validated.thingId, session.user.id);

  if (validated.action === ResponseType.COMPLETED) {
    await db.insert(responses).values({
      thingId: validated.thingId,
      type: ResponseType.COMPLETED,
      deferralCount: 0,
    });

    revalidatePath("/dashboard");
    return { success: true };
  }

  if (validated.action === ResponseType.IN_PROGRESS) {
    await db.insert(responses).values({
      thingId: validated.thingId,
      type: ResponseType.IN_PROGRESS,
      deferralCount: 0,
    });

    revalidatePath("/dashboard");
    return { success: true };
  }

  // Deferred — calculate deferral count
  const lastResponse = await getLastResponse(validated.thingId);
  const newDeferralCount =
    lastResponse?.type === ResponseType.DEFERRED
      ? lastResponse.deferralCount + 1
      : 1;

  const requiresCheckin = newDeferralCount >= thing.deferralThreshold;

  await db.insert(responses).values({
    thingId: validated.thingId,
    type: ResponseType.DEFERRED,
    deferralCount: newDeferralCount,
  });

  revalidatePath("/dashboard");
  return {
    success: true,
    requiresCheckin,
    deferralCount: newDeferralCount,
  };
}

export async function submitCheckin(input: SubmitCheckinInput) {
  const session = await requireAuth();
  const validated = submitCheckinSchema.parse(input);
  await verifyThingOwnership(validated.thingId, session.user.id);

  await db.insert(responses).values({
    thingId: validated.thingId,
    type: ResponseType.CHECKIN_COMPLETED,
    deferralCount: 0,
    checkinNotes: JSON.stringify(validated.notes),
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getResponseHistory(thingId: string, limit = 20) {
  const session = await requireAuth();
  await verifyThingOwnership(thingId, session.user.id);

  return db.query.responses.findMany({
    where: eq(responses.thingId, thingId),
    orderBy: [desc(responses.respondedAt)],
    limit,
  });
}

export async function getRecentCompletions(limit = 30) {
  const session = await requireAuth();

  const userThings = await db.query.things.findMany({
    where: eq(things.userId, session.user.id),
    columns: { id: true, label: true },
  });

  if (userThings.length === 0) return [];

  const thingMap = new Map(userThings.map((t) => [t.id, t.label]));
  const thingIds = userThings.map((t) => t.id);

  const { inArray } = await import("drizzle-orm");

  const completions = await db.query.responses.findMany({
    where: and(
      inArray(responses.thingId, thingIds),
      inArray(responses.type, [
        ResponseType.COMPLETED,
        ResponseType.IN_PROGRESS,
        ResponseType.CHECKIN_COMPLETED,
      ])
    ),
    orderBy: [desc(responses.respondedAt)],
    limit,
  });

  return completions.map((r) => ({
    id: r.id,
    thingLabel: thingMap.get(r.thingId) ?? "Unknown",
    type: r.type,
    respondedAt: r.respondedAt.toISOString(),
  }));
}

export async function getCurrentDeferralCount(thingId: string): Promise<number> {
  const lastResponse = await getLastResponse(thingId);

  if (!lastResponse || lastResponse.type !== ResponseType.DEFERRED) {
    return 0;
  }

  return lastResponse.deferralCount;
}
