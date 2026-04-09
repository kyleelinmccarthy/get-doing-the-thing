import { View, Text, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReminderSettings } from "@/components/features/ReminderSettings";
import { ResponseHistory } from "@/components/features/ResponseHistory";
import { useThing } from "@/lib/hooks/useThing";
import { getResponseHistory } from "@/lib/api/responses";
import { deleteThing } from "@/lib/api/things";
import { useTheme } from "@/lib/theme/context";

export default function ThingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: thing, isLoading } = useThing(id);
  const { data: responses = [] } = useQuery({
    queryKey: ["things", id, "responses"],
    queryFn: () => getResponseHistory(id),
    enabled: !!id,
  });
  const queryClient = useQueryClient();
  const { colors } = useTheme();

  const deactivate = useMutation({
    mutationFn: () => deleteThing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["things"] });
      router.back();
    },
  });

  function handleDeactivate() {
    Alert.alert(
      "Deactivate this thing?",
      "It will be removed from your dashboard.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: () => deactivate.mutate(),
        },
      ]
    );
  }

  if (isLoading || !thing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.textMuted, fontFamily: "Onest" }}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button variant="ghost" onPress={() => router.back()}>
            ← Back
          </Button>
        </View>

        <Card>
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                fontFamily: "InriaSerif-Bold",
                color: colors.textPrimary,
              }}
            >
              {thing.label}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textMuted,
                fontFamily: "Onest",
              }}
            >
              Snooze: {thing.snoozeMinutes}m · Threshold:{" "}
              {thing.deferralThreshold} deferrals
            </Text>
          </View>
        </Card>

        <Card>
          <ReminderSettings thingId={id} />
        </Card>

        <Card>
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: colors.textPrimary,
                fontFamily: "Onest",
              }}
            >
              History
            </Text>
            <ResponseHistory responses={responses} />
          </View>
        </Card>

        <Button
          variant="danger"
          fullWidth
          onPress={handleDeactivate}
          disabled={deactivate.isPending}
        >
          Deactivate thing
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
