import { useState } from "react";
import { View, Text } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useCheckin } from "@/lib/hooks/useCheckin";
import { useTheme } from "@/lib/theme/context";
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
  const [withinControl, setWithinControl] =
    useState<CheckinControlValue | null>(null);
  const [canDoAnyway, setCanDoAnyway] = useState<boolean | null>(null);
  const [alternative, setAlternative] = useState("");
  const checkin = useCheckin();
  const { colors } = useTheme();

  function handleSubmit() {
    checkin.mutate(
      {
        thingId,
        notes: {
          challenges,
          withinControl: withinControl!,
          canDoAnyway: canDoAnyway!,
          alternative: canDoAnyway === false ? alternative : null,
        },
      },
      { onSuccess: onComplete }
    );
  }

  const questionStyle = {
    fontSize: 18,
    fontWeight: "500" as const,
    color: colors.textPrimary,
    fontFamily: "Onest",
  };

  return (
    <Card>
      <View style={{ gap: 24 }}>
        {step === 0 && (
          <View style={{ gap: 16 }}>
            <Text style={questionStyle}>
              What challenges are preventing you from doing the thing?
            </Text>
            <Textarea
              value={challenges}
              onChangeText={setChallenges}
              placeholder="Be honest with yourself..."
              autoFocus
            />
            <Button
              variant="neutral"
              fullWidth
              onPress={() => setStep(1)}
              disabled={!challenges.trim()}
            >
              Next
            </Button>
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 16 }}>
            <Text style={questionStyle}>
              Are those challenges within your control?
            </Text>
            <View style={{ gap: 8 }}>
              {controlOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    withinControl === option.value ? "neutral" : "muted"
                  }
                  fullWidth
                  onPress={() => {
                    setWithinControl(option.value);
                    setStep(2);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 16 }}>
            <Text style={questionStyle}>
              Can you do the thing anyway?
            </Text>
            <View style={{ gap: 8 }}>
              <Button
                variant={canDoAnyway === true ? "neutral" : "muted"}
                fullWidth
                onPress={() => {
                  setCanDoAnyway(true);
                  handleSubmit();
                }}
                disabled={checkin.isPending}
              >
                Yes
              </Button>
              <Button
                variant={canDoAnyway === false ? "neutral" : "muted"}
                fullWidth
                onPress={() => {
                  setCanDoAnyway(false);
                  setStep(3);
                }}
              >
                No
              </Button>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: 16 }}>
            <Text style={questionStyle}>
              What alternative thing could you do instead?
            </Text>
            <Textarea
              value={alternative}
              onChangeText={setAlternative}
              placeholder="Something small counts..."
              autoFocus
            />
            <Button
              variant="neutral"
              fullWidth
              onPress={handleSubmit}
              disabled={checkin.isPending || !alternative.trim()}
            >
              {checkin.isPending ? "Saving..." : "Done"}
            </Button>
          </View>
        )}
      </View>
    </Card>
  );
}
