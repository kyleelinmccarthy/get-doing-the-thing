"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { things } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-utils";
import { createThingSchema, updateThingSchema } from "@doing-the-thing/shared";

export async function createThing(formData: FormData) {
  const session = await requireAuth();

  const input = createThingSchema.parse({
    label: formData.get("label"),
    snoozeMinutes: formData.get("snoozeMinutes")
      ? Number(formData.get("snoozeMinutes"))
      : undefined,
    deferralThreshold: formData.get("deferralThreshold")
      ? Number(formData.get("deferralThreshold"))
      : undefined,
  });

  await db.insert(things).values({
    userId: session.user.id,
    label: input.label,
    snoozeMinutes: input.snoozeMinutes,
    deferralThreshold: input.deferralThreshold,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function getThings() {
  const session = await requireAuth();

  return db.query.things.findMany({
    where: and(
      eq(things.userId, session.user.id),
      eq(things.isActive, true)
    ),
    orderBy: [desc(things.createdAt)],
  });
}

export async function getThing(id: string) {
  const session = await requireAuth();

  const thing = await db.query.things.findFirst({
    where: and(
      eq(things.id, id),
      eq(things.userId, session.user.id)
    ),
  });

  if (!thing) {
    return null;
  }

  return thing;
}

export async function updateThing(id: string, formData: FormData) {
  const session = await requireAuth();

  const rawInput: Record<string, unknown> = {};
  const label = formData.get("label");
  const snoozeMinutes = formData.get("snoozeMinutes");
  const deferralThreshold = formData.get("deferralThreshold");

  if (label) rawInput.label = label;
  if (snoozeMinutes) rawInput.snoozeMinutes = Number(snoozeMinutes);
  if (deferralThreshold) rawInput.deferralThreshold = Number(deferralThreshold);

  const input = updateThingSchema.parse(rawInput);

  await db
    .update(things)
    .set(input)
    .where(and(eq(things.id, id), eq(things.userId, session.user.id)));

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/things/${id}`);
}

export async function deactivateThing(id: string) {
  const session = await requireAuth();

  await db
    .update(things)
    .set({ isActive: false })
    .where(and(eq(things.id, id), eq(things.userId, session.user.id)));

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
