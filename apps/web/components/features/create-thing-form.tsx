"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createThing } from "@/lib/actions/things";
import {
  DEFAULT_SNOOZE_MINUTES,
  DEFAULT_DEFERRAL_THRESHOLD,
  SNOOZE_PRESETS,
} from "@doing-the-thing/shared";

export function CreateThingForm() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card>
      <form action={createThing} className="space-y-4">
        <h2
          className="text-lg font-medium text-center"
          style={{ color: "var(--text-primary)" }}
        >
          Add a thing
        </h2>
        <Input
          id="label"
          name="label"
          label="What's the thing?"
          placeholder="Exercise, meditate, write..."
          required
          autoFocus
        />

        {showAdvanced ? (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="snoozeMinutes"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Snooze duration (minutes)
              </label>
              <select
                id="snoozeMinutes"
                name="snoozeMinutes"
                defaultValue={DEFAULT_SNOOZE_MINUTES}
                className="w-full rounded-btn border px-4 py-3 text-base bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border)]"
              >
                {SNOOZE_PRESETS.map((mins) => (
                  <option key={mins} value={mins}>
                    {mins < 60 ? `${mins} minutes` : `${mins / 60} hour${mins > 60 ? "s" : ""}`}
                  </option>
                ))}
              </select>
            </div>
            <Input
              id="deferralThreshold"
              name="deferralThreshold"
              type="number"
              label="Check-in after how many deferrals?"
              defaultValue={DEFAULT_DEFERRAL_THRESHOLD}
              min={1}
              max={20}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAdvanced(true)}
            className="text-sm underline"
            style={{ color: "var(--text-muted)" }}
          >
            Advanced settings
          </button>
        )}

        <Button type="submit" variant="neutral" fullWidth>
          Add thing
        </Button>
      </form>
    </Card>
  );
}
