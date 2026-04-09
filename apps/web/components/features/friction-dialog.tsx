"use client";

import { Card } from "@/components/ui/card";

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
          className="text-2xl font-medium font-serif"
          style={{ color: "var(--text-primary)" }}
        >
          Are you sure?
        </p>
        <div className="space-y-3">
          <button
            className="w-full rounded-btn px-6 py-4 text-base font-medium text-[var(--btn-text)] transition-all duration-150 bg-[var(--btn-doing)] hover:bg-[var(--btn-doing-hover)] disabled:opacity-50"
            onClick={onSelfCorrection}
            disabled={isPending}
          >
            Alright, doing the thing
          </button>
          <button
            className="w-full rounded-btn px-6 py-4 text-base font-medium text-[var(--btn-text)] transition-all duration-150 bg-[var(--btn-cant)] hover:bg-[var(--btn-cant-hover)] disabled:opacity-50"
            onClick={onDefer}
            disabled={isPending}
          >
            For real, I'll do it soon
          </button>
        </div>
      </div>
    </Card>
  );
}
