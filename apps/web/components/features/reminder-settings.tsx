"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createReminder, deleteReminder } from "@/lib/actions/reminders";

interface Reminder {
  id: string;
  scheduleCron: string;
}

interface ReminderSettingsProps {
  thingId: string;
  reminders: Reminder[];
}

const presets = [
  { label: "Every morning (9am)", cron: "0 9 * * *" },
  { label: "Every evening (6pm)", cron: "0 18 * * *" },
  { label: "Weekdays at 9am", cron: "0 9 * * 1-5" },
  { label: "Twice daily (9am, 6pm)", cron: "0 9,18 * * *" },
];

function cronToLabel(cron: string): string {
  const preset = presets.find((p) => p.cron === cron);
  return preset?.label ?? cron;
}

export function ReminderSettings({ thingId, reminders: initialReminders }: ReminderSettingsProps) {
  const [showPresets, setShowPresets] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAddPreset(cronExpression: string) {
    const formData = new FormData();
    formData.set("thingId", thingId);
    formData.set("scheduleCron", cronExpression);

    startTransition(async () => {
      await createReminder(formData);
      setShowPresets(false);
    });
  }

  function handleDelete(reminderId: string) {
    startTransition(async () => {
      await deleteReminder(reminderId);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Reminders
        </h4>
        <Button
          variant="ghost"
          className="text-xs px-2 py-1"
          onClick={() => setShowPresets(!showPresets)}
        >
          {showPresets ? "Cancel" : "Add reminder"}
        </Button>
      </div>

      {initialReminders.length > 0 && (
        <div className="space-y-2">
          {initialReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between py-1.5"
            >
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                {cronToLabel(reminder.scheduleCron)}
              </span>
              <button
                onClick={() => handleDelete(reminder.id)}
                className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-muted)" }}
                disabled={isPending}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {initialReminders.length === 0 && !showPresets && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          No reminders set.
        </p>
      )}

      {showPresets && (
        <div className="space-y-2">
          {presets.map((preset) => (
            <Button
              key={preset.cron}
              variant="muted"
              fullWidth
              className="text-sm"
              onClick={() => handleAddPreset(preset.cron)}
              disabled={isPending}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
