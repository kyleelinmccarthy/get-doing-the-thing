import { FlatList, View, Text } from "react-native";
import { NudgeCard } from "./NudgeCard";
import { useTheme } from "@/lib/theme/context";
import type { Thing } from "@doing-the-thing/shared";

interface ThingListProps {
  things: Thing[];
  deferralCounts: Map<string, number>;
}

export function ThingList({ things, deferralCounts }: ThingListProps) {
  const { colors } = useTheme();

  if (things.length === 0) {
    return (
      <View style={{ alignItems: "center", paddingVertical: 40 }}>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 16,
            fontFamily: "Onest",
          }}
        >
          No things yet. Add one to get started.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={things}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NudgeCard
          thingId={item.id}
          thingLabel={item.label}
          currentDeferralCount={deferralCounts.get(item.id) ?? 0}
          deferralThreshold={item.deferralThreshold}
          snoozeMinutes={item.snoozeMinutes}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      scrollEnabled={false}
    />
  );
}
