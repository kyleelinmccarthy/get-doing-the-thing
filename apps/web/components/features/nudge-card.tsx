"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrictionDialog } from "./friction-dialog";
import { CheckinForm } from "./checkin-form";
import { respondToNudge, type NudgeResponse } from "@/lib/actions/responses";
import { ResponseType, type NudgeState } from "@doing-the-thing/shared";

type ViewState = "nudge" | "friction" | "checkin" | "done";

export function NudgeCard({
  thingId,
  thingLabel,
  currentDeferralCount,
  deferralThreshold,
  snoozeMinutes,
}: NudgeState) {
  const [view, setView] = useState<ViewState>("nudge");
  const [deferralCount, setDeferralCount] = useState(currentDeferralCount);
  const [isPending, startTransition] = useTransition();

  function handleResponse(action: string) {
    startTransition(async () => {
      const result = await respondToNudge({
        thingId,
        action: action as "completed" | "in_progress" | "deferred",
      });

      if (action === ResponseType.COMPLETED || action === ResponseType.IN_PROGRESS) {
        setView("done");
        setTimeout(() => setView("nudge"), 2000);
        return;
      }

      if (result.requiresCheckin) {
        setView("checkin");
      } else {
        setDeferralCount(result.deferralCount ?? deferralCount + 1);
      }
    });
  }

  function handleCheckinComplete() {
    setDeferralCount(0);
    setView("done");
    setTimeout(() => setView("nudge"), 2000);
  }

  function handleSelfCorrection() {
    startTransition(async () => {
      await respondToNudge({
        thingId,
        action: ResponseType.IN_PROGRESS,
      });
      setDeferralCount(0);
      setView("done");
      setTimeout(() => setView("nudge"), 2000);
    });
  }

  if (view === "done") {
    return (
      <Card className="text-center animate-pulse">
        <p
          className="text-xl font-medium"
          style={{ color: "var(--success)" }}
        >
          Done.
        </p>
      </Card>
    );
  }

  if (view === "checkin") {
    return (
      <CheckinForm
        thingId={thingId}
        onComplete={handleCheckinComplete}
      />
    );
  }

  if (view === "friction") {
    return (
      <FrictionDialog
        snoozeMinutes={snoozeMinutes}
        onSelfCorrection={handleSelfCorrection}
        onDefer={() => {
          handleResponse(ResponseType.DEFERRED);
          setView("nudge");
        }}
        isPending={isPending}
      />
    );
  }

  return (
    <Card>
      <div className="text-center space-y-6">
        <div>
          <p
            className="text-2xl font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Do the thing.
          </p>
          {thingLabel !== "The Thing" && (
            <p
              className="mt-1 text-base"
              style={{ color: "var(--text-muted)" }}
            >
              {thingLabel}
            </p>
          )}
        </div>
        <div className="space-y-3">
          <Button
            variant="success"
            fullWidth
            onClick={() => handleResponse(ResponseType.COMPLETED)}
            disabled={isPending}
          >
            Did the thing
          </Button>
          <Button
            variant="neutral"
            fullWidth
            onClick={() => handleResponse(ResponseType.IN_PROGRESS)}
            disabled={isPending}
          >
            Doing the thing
          </Button>
          <Button
            variant="muted"
            fullWidth
            onClick={() => {
              if (deferralCount + 1 >= deferralThreshold) {
                handleResponse(ResponseType.DEFERRED);
              } else {
                setView("friction");
              }
            }}
            disabled={isPending}
          >
            Can't right now
          </Button>
        </div>
      </div>
    </Card>
  );
}
