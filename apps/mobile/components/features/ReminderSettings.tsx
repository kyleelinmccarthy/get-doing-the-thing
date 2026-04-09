import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Button } from "@/components/ui/Button";
import { useReminders, useCreateReminder, useDeleteReminder } from "@/lib/hooks/useReminders";
import { useTheme } from "@/lib/theme/context";
import type { Reminder } from "@doing-the-thing/shared";

interface ReminderSettingsProps {
  thingId: string;
}

const CRON_PRESETS = [
  { label: "Every morning (9 AM)", cron: "0 9 * * *" },
  { label: "Every evening (6 PM)", cron: "0 18 * * *" },
  { label: "Weekday mornings", cron: "0 9 * * 1-5" },
  { label: "Twice daily (9 AM & 6 PM)", cron: "0 9,18 * * *" },
];

export function ReminderSettings({ thingId }: ReminderSettingsProps) {
  const [showPresets, setShowPresets] = useState(false);
  const { data: reminders = [] } = useReminders(thingId);
  const createReminder = useCreateReminder();
  const deleteReminder = useDeleteReminder();
  const { colors } = useTheme();

  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: colors.textPrimary,
          fontFamily: "Onest",
        }}
      >
        Reminders
      </Text>

      {reminders.map((reminder: Reminder) => (
        <View
          key={reminder.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.textPrimary,
              fontFamily: "Onest",
            }}
          >
            {reminder.scheduleCron}
          </Text>
          <Pressable
            onPress={() => deleteReminder.mutate(reminder.id)}
            disabled={deleteReminder.isPending}
          >
            <Text style={{ color: "#DC6B6B", fontSize: 14 }}>Remove</Text>
          </Pressable>
        </View>
      ))}

      {showPresets ? (
        <View style={{ gap: 8 }}>
          {CRON_PRESETS.map((preset) => (
            <Button
              key={preset.cron}
              variant="ghost"
              fullWidth
              onPress={() => {
                createReminder.mutate(
                  { thingId, scheduleCron: preset.cron },
                  { onSuccess: () => setShowPresets(false) }
                );
              }}
              disabled={createReminder.isPending}
            >
              {preset.label}
            </Button>
          ))}
          <Button variant="muted" onPress={() => setShowPresets(false)}>
            Cancel
          </Button>
        </View>
      ) : (
        <Button variant="ghost" onPress={() => setShowPresets(true)}>
          + Add reminder
        </Button>
      )}
    </View>
  );
}
