import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { things } from "@/lib/db/schema";
import type { CreateThingInput, UpdateThingInput } from "@doing-the-thing/shared";

export async function findThingsForUser(userId: string) {
  return db.query.things.findMany({
    where: and(eq(things.userId, userId), eq(things.isActive, true)),
    orderBy: [desc(things.createdAt)],
  });
}

export async function findThing(id: string, userId: string) {
  return db.query.things.findFirst({
    where: and(eq(things.id, id), eq(things.userId, userId)),
  });
}

export async function insertThing(userId: string, input: CreateThingInput) {
  const [thing] = await db
    .insert(things)
    .values({
      userId,
      label: input.label,
      snoozeMinutes: input.snoozeMinutes,
      deferralThreshold: input.deferralThreshold,
    })
    .returning();

  return thing;
}

export async function patchThing(
  id: string,
  userId: string,
  input: UpdateThingInput
) {
  const [updated] = await db
    .update(things)
    .set(input)
    .where(and(eq(things.id, id), eq(things.userId, userId)))
    .returning();

  return updated ?? null;
}

export async function deactivateThing(id: string, userId: string) {
  await db
    .update(things)
    .set({ isActive: false })
    .where(and(eq(things.id, id), eq(things.userId, userId)));
}
