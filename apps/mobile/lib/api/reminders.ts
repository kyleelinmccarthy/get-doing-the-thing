import { apiFetch } from "./client";
import type { Reminder } from "@doing-the-thing/shared";

export function getReminders(thingId: string): Promise<Reminder[]> {
  return apiFetch(`/things/${thingId}/reminders`);
}

export function createReminder(
  thingId: string,
  scheduleCron: string
): Promise<Reminder> {
  return apiFetch(`/things/${thingId}/reminders`, {
    method: "POST",
    body: { scheduleCron },
  });
}

export function deleteReminder(reminderId: string): Promise<void> {
  return apiFetch(`/reminders/${reminderId}`, { method: "DELETE" });
}
