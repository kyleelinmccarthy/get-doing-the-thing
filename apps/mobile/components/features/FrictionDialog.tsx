import { View, Text } from "react-native";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/theme/context";

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
  const { colors } = useTheme();

  return (
    <Card>
      <View style={{ alignItems: "center", gap: 24 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "500",
            fontFamily: "InriaSerif",
            color: colors.textPrimary,
          }}
        >
          Are you sure?
        </Text>
        <View style={{ gap: 12, width: "100%" }}>
          <Button
            variant="neutral"
            fullWidth
            onPress={onSelfCorrection}
            disabled={isPending}
          >
            Alright, doing the thing
          </Button>
          <Button
            variant="muted"
            fullWidth
            onPress={onDefer}
            disabled={isPending}
          >
            For real, I'll do it soon
          </Button>
        </View>
      </View>
    </Card>
  );
}
