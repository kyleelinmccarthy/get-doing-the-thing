"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitCheckin } from "@/lib/actions/responses";
import type { CheckinControlValue } from "@doing-the-thing/shared";

interface CheckinFormProps {
  thingId: string;
  onComplete: () => void;
}

const controlOptions: { value: CheckinControlValue; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "partially", label: "Partially" },
];

export function CheckinForm({ thingId, onComplete }: CheckinFormProps) {
  const [step, setStep] = useState(0);
  const [challenges, setChallenges] = useState("");
  const [withinControl, setWithinControl] = useState<CheckinControlValue | null>(null);
  const [canDoAnyway, setCanDoAnyway] = useState<boolean | null>(null);
  const [alternative, setAlternative] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      await submitCheckin({
        thingId,
        notes: {
          challenges,
          withinControl: withinControl!,
          canDoAnyway: canDoAnyway!,
          alternative: canDoAnyway === false ? alternative : null,
        },
      });
      onComplete();
    });
  }

  return (
    <Card>
      <div className="space-y-6">
        {step === 0 && (
          <div className="space-y-4">
            <p
              className="text-lg font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              What challenges are preventing you from doing the thing?
            </p>
            <Textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Be honest with yourself..."
              autoFocus
            />
            <Button
              variant="neutral"
              fullWidth
              onClick={() => setStep(1)}
              disabled={!challenges.trim()}
            >
              Next
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p
              className="text-lg font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Are those challenges within your control?
            </p>
            <div className="space-y-2">
              {controlOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={withinControl === option.value ? "neutral" : "muted"}
                  fullWidth
                  onClick={() => {
                    setWithinControl(option.value);
                    setStep(2);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p
              className="text-lg font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Can you do the thing anyway?
            </p>
            <div className="space-y-2">
              <Button
                variant={canDoAnyway === true ? "neutral" : "muted"}
                fullWidth
                onClick={() => {
                  setCanDoAnyway(true);
                  handleSubmit();
                }}
                disabled={isPending}
              >
                Yes
              </Button>
              <Button
                variant={canDoAnyway === false ? "neutral" : "muted"}
                fullWidth
                onClick={() => {
                  setCanDoAnyway(false);
                  setStep(3);
                }}
              >
                No
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p
              className="text-lg font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              What alternative thing could you do instead?
            </p>
            <Textarea
              value={alternative}
              onChange={(e) => setAlternative(e.target.value)}
              placeholder="Something small counts..."
              autoFocus
            />
            <Button
              variant="neutral"
              fullWidth
              onClick={handleSubmit}
              disabled={isPending || !alternative.trim()}
            >
              {isPending ? "Saving..." : "Done"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
