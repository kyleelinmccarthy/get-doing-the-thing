"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FrictionDialogProps {
  snoozeMinutes: number;
  onSelfCorrection: () => void;
  onDefer: () => void;
  isPending: boolean;
}

export function FrictionDialog({
  snoozeMinutes,
  onSelfCorrection,
  onDefer,
  isPending,
}: FrictionDialogProps) {
  return (
    <Card>
      <div className="text-center space-y-6">
        <p
          className="text-2xl font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Are you sure?
        </p>
        <div className="space-y-3">
          <Button
            variant="success"
            fullWidth
            onClick={onSelfCorrection}
            disabled={isPending}
          >
            Alright, doing the thing
          </Button>
          <Button
            variant="muted"
            fullWidth
            onClick={onDefer}
            disabled={isPending}
          >
            For real, I'll do it soon
          </Button>
        </div>
      </div>
    </Card>
  );
}
