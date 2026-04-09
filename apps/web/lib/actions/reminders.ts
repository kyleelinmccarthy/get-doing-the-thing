"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { reminders, things } from "@/lib/db/schema";
import { requireAuth } from "@/lib/auth-utils";
import { createReminderSchema } from "@doing-the-thing/shared";
import { scheduleReminder, unscheduleReminder } from "@/lib/notifications/scheduler";

async function verifyThingOwnership(thingId: string, userId: string) {
  const thing = await db.query.things.findFirst({
    where: and(eq(things.id, thingId), eq(things.userId, userId)),
  });

  if (!thing) {
    throw new Error("Thing not found");
  }

  return thing;
}

export async function createReminder(formData: FormData) {
  const session = await requireAuth();

  const input = createReminderSchema.parse({
    thingId: formData.get("thingId"),
    scheduleCron: formData.get("scheduleCron"),
  });

  const thing = await verifyThingOwnership(input.thingId, session.user.id);

  const [reminder] = await db
    .insert(reminders)
    .values({
      thingId: input.thingId,
      scheduleCron: input.scheduleCron,
    })
    .returning();

  if (reminder) {
    scheduleReminder(reminder.id, reminder.scheduleCron, thing);
  }

  revalidatePath("/dashboard");
}

export async function deleteReminder(reminderId: string) {
  const session = await requireAuth();

  const reminder = await db.query.reminders.findFirst({
    where: eq(reminders.id, reminderId),
    with: { thing: true },
  });

  if (!reminder || reminder.thing.userId !== session.user.id) {
    throw new Error("Reminder not found");
  }

  await db
    .update(reminders)
    .set({ isActive: false })
    .where(eq(reminders.id, reminderId));

  unscheduleReminder(reminderId);
  revalidatePath("/dashboard");
}

export async function getReminders(thingId: string) {
  const session = await requireAuth();
  await verifyThingOwnership(thingId, session.user.id);

  return db.query.reminders.findMany({
    where: and(
      eq(reminders.thingId, thingId),
      eq(reminders.isActive, true)
    ),
  });
}
