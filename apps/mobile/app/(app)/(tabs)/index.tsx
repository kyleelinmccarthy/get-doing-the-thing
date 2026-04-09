import { useEffect, useState } from "react";
import { ScrollView, RefreshControl, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThingList } from "@/components/features/ThingList";
import { DoneThings } from "@/components/features/DoneThings";
import { NotificationPrompt } from "@/components/features/NotificationPrompt";
import { useThings } from "@/lib/hooks/useThings";
import { useCompletions } from "@/lib/hooks/useCompletions";
import { getDeferralCount } from "@/lib/api/responses";
import { useTheme } from "@/lib/theme/context";

export default function DashboardScreen() {
  const { data: things = [], isLoading, refetch } = useThings();
  const { data: completions = [], refetch: refetchCompletions } =
    useCompletions();
  const [refreshing, setRefreshing] = useState(false);
  const [deferralCounts, setDeferralCounts] = useState<Map<string, number>>(
    new Map()
  );
  const { colors } = useTheme();

  useEffect(() => {
    if (things.length > 0) {
      Promise.all(
        things.map(async (t) => {
          const { count } = await getDeferralCount(t.id);
          return [t.id, count] as const;
        })
      ).then((entries) => setDeferralCounts(new Map(entries)));
    }
  }, [things]);

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([refetch(), refetchCompletions()]);
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            fontFamily: "InriaSerif-Bold",
            color: colors.textPrimary,
          }}
        >
          Doing The Thing
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      >
        <NotificationPrompt />

        {isLoading ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 16,
                fontFamily: "Onest",
              }}
            >
              Loading...
            </Text>
          </View>
        ) : (
          <ThingList things={things} deferralCounts={deferralCounts} />
        )}

        <DoneThings completions={completions} />
      </ScrollView>
    </SafeAreaView>
  );
}
