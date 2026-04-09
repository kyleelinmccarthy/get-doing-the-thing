import { useState } from "react";
import { View, Text } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FrictionDialog } from "./FrictionDialog";
import { CheckinForm } from "./CheckinForm";
import { useRespond } from "@/lib/hooks/useRespond";
import { useTheme } from "@/lib/theme/context";
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
  const respond = useRespond();
  const { colors } = useTheme();

  function handleResponse(action: "completed" | "in_progress" | "deferred") {
    respond.mutate(
      { thingId, action },
      {
        onSuccess: (result) => {
          if (
            action === ResponseType.COMPLETED ||
            action === ResponseType.IN_PROGRESS
          ) {
            setView("done");
            setTimeout(() => setView("nudge"), 2000);
            return;
          }

          if (result.requiresCheckin) {
            setView("checkin");
          } else {
            setDeferralCount(result.deferralCount ?? deferralCount + 1);
          }
        },
      }
    );
  }

  function handleCheckinComplete() {
    setDeferralCount(0);
    setView("done");
    setTimeout(() => setView("nudge"), 2000);
  }

  function handleSelfCorrection() {
    respond.mutate(
      { thingId, action: ResponseType.IN_PROGRESS },
      {
        onSuccess: () => {
          setDeferralCount(0);
          setView("done");
          setTimeout(() => setView("nudge"), 2000);
        },
      }
    );
  }

  if (view === "done") {
    return (
      <Card>
        <View style={{ alignItems: "center", paddingVertical: 12 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              color: colors.btnDid,
              fontFamily: "Onest",
            }}
          >
            Done.
          </Text>
        </View>
      </Card>
    );
  }

  if (view === "checkin") {
    return <CheckinForm thingId={thingId} onComplete={handleCheckinComplete} />;
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
        isPending={respond.isPending}
      />
    );
  }

  return (
    <Card>
      <View style={{ alignItems: "center", gap: 32 }}>
        <View style={{ alignItems: "center", gap: 8, paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 3,
              color: colors.textMuted,
              fontFamily: "Onest",
            }}
          >
            Do the thing.
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              fontFamily: "InriaSerif",
              color: colors.textPrimary,
              textAlign: "center",
            }}
          >
            {thingLabel}
          </Text>
        </View>
        <View style={{ gap: 12, width: "100%" }}>
          <Button
            variant="success"
            fullWidth
            onPress={() => handleResponse(ResponseType.COMPLETED)}
            disabled={respond.isPending}
          >
            Did the thing
          </Button>
          <Button
            variant="neutral"
            fullWidth
            onPress={() => handleResponse(ResponseType.IN_PROGRESS)}
            disabled={respond.isPending}
          >
            Doing the thing
          </Button>
          <Button
            variant="muted"
            fullWidth
            onPress={() => {
              if (deferralCount + 1 >= deferralThreshold) {
                handleResponse(ResponseType.DEFERRED);
              } else {
                setView("friction");
              }
            }}
            disabled={respond.isPending}
          >
            Can't right now
          </Button>
        </View>
      </View>
    </Card>
  );
}
