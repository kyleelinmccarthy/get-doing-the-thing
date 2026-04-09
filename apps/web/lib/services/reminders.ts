import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { reminders, things } from "@/lib/db/schema";
import type { CreateReminderInput } from "@doing-the-thing/shared";
import {
  scheduleReminder,
  unscheduleReminder,
} from "@/lib/notifications/scheduler";

async function verifyThingOwnership(thingId: string, userId: string) {
  const thing = await db.query.things.findFirst({
    where: and(eq(things.id, thingId), eq(things.userId, userId)),
  });

  if (!thing) {
    throw new Error("Thing not found");
  }

  return thing;
}

export async function findReminders(thingId: string, userId: string) {
  await verifyThingOwnership(thingId, userId);

  return db.query.reminders.findMany({
    where: and(eq(reminders.thingId, thingId), eq(reminders.isActive, true)),
  });
}

export async function insertReminder(userId: string, input: CreateReminderInput) {
  const thing = await verifyThingOwnership(input.thingId, userId);

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

  return reminder;
}

export async function removeReminder(reminderId: string, userId: string) {
  const reminder = await db.query.reminders.findFirst({
    where: eq(reminders.id, reminderId),
    with: { thing: true },
  });

  if (!reminder || reminder.thing.userId !== userId) {
    throw new Error("Reminder not found");
  }

  await db
    .update(reminders)
    .set({ isActive: false })
    .where(eq(reminders.id, reminderId));

  unscheduleReminder(reminderId);
}
