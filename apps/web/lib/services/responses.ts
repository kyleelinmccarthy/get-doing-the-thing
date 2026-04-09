import { eq, and, desc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { things, responses } from "@/lib/db/schema";
import {
  type RespondToNudgeInput,
  type SubmitCheckinInput,
  ResponseType,
} from "@doing-the-thing/shared";

export type NudgeResponse = {
  success: boolean;
  requiresCheckin?: boolean;
  deferralCount?: number;
};

export async function verifyThingOwnership(thingId: string, userId: string) {
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
  userId: string,
  input: RespondToNudgeInput
): Promise<NudgeResponse> {
  const thing = await verifyThingOwnership(input.thingId, userId);

  if (input.action === ResponseType.COMPLETED) {
    await db.insert(responses).values({
      thingId: input.thingId,
      type: ResponseType.COMPLETED,
      deferralCount: 0,
    });
    return { success: true };
  }

  if (input.action === ResponseType.IN_PROGRESS) {
    await db.insert(responses).values({
      thingId: input.thingId,
      type: ResponseType.IN_PROGRESS,
      deferralCount: 0,
    });
    return { success: true };
  }

  // Deferred — calculate deferral count
  const lastResponse = await getLastResponse(input.thingId);
  const newDeferralCount =
    lastResponse?.type === ResponseType.DEFERRED
      ? lastResponse.deferralCount + 1
      : 1;

  const requiresCheckin = newDeferralCount >= thing.deferralThreshold;

  await db.insert(responses).values({
    thingId: input.thingId,
    type: ResponseType.DEFERRED,
    deferralCount: newDeferralCount,
  });

  return {
    success: true,
    requiresCheckin,
    deferralCount: newDeferralCount,
  };
}

export async function submitCheckin(userId: string, input: SubmitCheckinInput) {
  await verifyThingOwnership(input.thingId, userId);

  await db.insert(responses).values({
    thingId: input.thingId,
    type: ResponseType.CHECKIN_COMPLETED,
    deferralCount: 0,
    checkinNotes: JSON.stringify(input.notes),
  });

  return { success: true };
}

export async function findResponseHistory(
  thingId: string,
  userId: string,
  limit = 20
) {
  await verifyThingOwnership(thingId, userId);

  return db.query.responses.findMany({
    where: eq(responses.thingId, thingId),
    orderBy: [desc(responses.respondedAt)],
    limit,
  });
}

export async function findRecentCompletions(userId: string, limit = 30) {
  const userThings = await db.query.things.findMany({
    where: eq(things.userId, userId),
    columns: { id: true, label: true },
  });

  if (userThings.length === 0) return [];

  const thingMap = new Map(userThings.map((t) => [t.id, t.label]));
  const thingIds = userThings.map((t) => t.id);

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

export async function getDeferralCount(thingId: string): Promise<number> {
  const lastResponse = await getLastResponse(thingId);

  if (!lastResponse || lastResponse.type !== ResponseType.DEFERRED) {
    return 0;
  }

  return lastResponse.deferralCount;
}
