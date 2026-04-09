import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateThing } from "@/lib/hooks/useCreateThing";
import { useTheme } from "@/lib/theme/context";
import { SNOOZE_PRESETS, DEFAULT_SNOOZE_MINUTES, DEFAULT_DEFERRAL_THRESHOLD } from "@doing-the-thing/shared";

export default function AddThingScreen() {
  const [label, setLabel] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [snoozeMinutes, setSnoozeMinutes] = useState(DEFAULT_SNOOZE_MINUTES);
  const [deferralThreshold, setDeferralThreshold] = useState(
    DEFAULT_DEFERRAL_THRESHOLD
  );
  const createThing = useCreateThing();
  const { colors } = useTheme();

  function handleCreate() {
    createThing.mutate(
      { label: label.trim(), snoozeMinutes, deferralThreshold },
      {
        onSuccess: () => {
          setLabel("");
          setShowAdvanced(false);
          setSnoozeMinutes(DEFAULT_SNOOZE_MINUTES);
          setDeferralThreshold(DEFAULT_DEFERRAL_THRESHOLD);
          router.push("/(app)/(tabs)/");
        },
      }
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              fontFamily: "InriaSerif-Bold",
              color: colors.textPrimary,
            }}
          >
            New thing
          </Text>

          <Card>
            <View style={{ gap: 16 }}>
              <Input
                label="What's the thing?"
                value={label}
                onChangeText={setLabel}
                placeholder="Exercise, study, clean..."
                autoFocus
              />

              <Pressable onPress={() => setShowAdvanced(!showAdvanced)}>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 14,
                    fontFamily: "Onest",
                  }}
                >
                  {showAdvanced ? "▼" : "▶"} Advanced settings
                </Text>
              </Pressable>

              {showAdvanced && (
                <View style={{ gap: 12 }}>
                  <View style={{ gap: 6 }}>
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: 14,
                        fontWeight: "500",
                        fontFamily: "Onest",
                      }}
                    >
                      Snooze duration
                    </Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {SNOOZE_PRESETS.map((mins) => (
                        <Pressable
                          key={mins}
                          onPress={() => setSnoozeMinutes(mins)}
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 8,
                            alignItems: "center",
                            backgroundColor:
                              snoozeMinutes === mins
                                ? colors.accent
                                : colors.bgSecondary,
                            borderWidth: 1,
                            borderColor: colors.border,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              color:
                                snoozeMinutes === mins
                                  ? colors.btnText
                                  : colors.textPrimary,
                              fontFamily: "Onest",
                            }}
                          >
                            {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <Input
                    label="Deferral threshold"
                    value={String(deferralThreshold)}
                    onChangeText={(t) =>
                      setDeferralThreshold(Number(t) || DEFAULT_DEFERRAL_THRESHOLD)
                    }
                    keyboardType="number-pad"
                    placeholder="3"
                  />
                </View>
              )}

              <Button
                variant="success"
                fullWidth
                onPress={handleCreate}
                disabled={!label.trim() || createThing.isPending}
              >
                {createThing.isPending ? "Creating..." : "Add thing"}
              </Button>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
