import * as cron from "node-cron";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { reminders, things } from "@/lib/db/schema";
import { sendPushToUser } from "./web-push";

const activeJobs = new Map<string, cron.ScheduledTask>();

export async function startScheduler() {
  console.log("[Scheduler] Starting notification scheduler...");

  const activeReminders = await db.query.reminders.findMany({
    where: eq(reminders.isActive, true),
    with: {
      thing: true,
    },
  });

  for (const reminder of activeReminders) {
    scheduleReminder(reminder.id, reminder.scheduleCron, reminder.thing);
  }

  console.log(`[Scheduler] Loaded ${activeReminders.length} active reminders`);
}

export function scheduleReminder(
  reminderId: string,
  cronExpression: string,
  thing: { id: string; label: string; userId: string }
) {
  // Remove existing job if any
  unscheduleReminder(reminderId);

  if (!cron.validate(cronExpression)) {
    console.error(`[Scheduler] Invalid cron expression for reminder ${reminderId}: ${cronExpression}`);
    return;
  }

  const job = cron.schedule(cronExpression, async () => {
    try {
      await sendPushToUser(thing.userId, {
        title: "Do the thing.",
        body: thing.label,
        data: {
          thingId: thing.id,
          url: `/dashboard`,
        },
      });
    } catch (error) {
      console.error(`[Scheduler] Failed to send notification for reminder ${reminderId}:`, error);
    }
  });

  activeJobs.set(reminderId, job);
}

export function unscheduleReminder(reminderId: string) {
  const existing = activeJobs.get(reminderId);
  if (existing) {
    existing.stop();
    activeJobs.delete(reminderId);
  }
}

export function stopScheduler() {
  for (const [id, job] of activeJobs) {
    job.stop();
  }
  activeJobs.clear();
  console.log("[Scheduler] Stopped all scheduled jobs");
}
