"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { createReminderSchema } from "@doing-the-thing/shared";
import * as remindersService from "@/lib/services/reminders";

export async function createReminder(formData: FormData) {
  const session = await requireAuth();

  const input = createReminderSchema.parse({
    thingId: formData.get("thingId"),
    scheduleCron: formData.get("scheduleCron"),
  });

  await remindersService.insertReminder(session.user.id, input);

  revalidatePath("/dashboard");
}

export async function deleteReminder(reminderId: string) {
  const session = await requireAuth();

  await remindersService.removeReminder(reminderId, session.user.id);

  revalidatePath("/dashboard");
}

export async function getReminders(thingId: string) {
  const session = await requireAuth();
  return remindersService.findReminders(thingId, session.user.id);
}
