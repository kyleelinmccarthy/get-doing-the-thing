import { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { useTheme } from "@/lib/theme/context";
import { ResponseType } from "@doing-the-thing/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Completion {
  id: string;
  thingLabel: string;
  type: string;
  respondedAt: string;
}

interface DoneThingsProps {
  completions: Completion[];
}

const typeLabels: Record<string, string> = {
  [ResponseType.COMPLETED]: "Did the thing",
  [ResponseType.IN_PROGRESS]: "Doing the thing",
  [ResponseType.CHECKIN_COMPLETED]: "Checked in",
};

const EXPANDED_KEY = "show-done-things";

export function DoneThings({ completions }: DoneThingsProps) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem(EXPANDED_KEY).then((val) => {
      if (val === "true") setExpanded(true);
    });
  }, []);

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    AsyncStorage.setItem(EXPANDED_KEY, String(next));
  }

  if (completions.length === 0) return null;

  return (
    <View>
      <Pressable
        onPress={toggle}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.textSecondary,
            fontFamily: "Onest",
          }}
        >
          Done things ({completions.length})
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>
          {expanded ? "▼" : "▶"}
        </Text>
      </Pressable>

      {expanded && (
        <FlatList
          data={completions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textPrimary,
                    fontFamily: "Onest",
                  }}
                  numberOfLines={1}
                >
                  {item.thingLabel}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.textMuted,
                    fontFamily: "Onest",
                  }}
                >
                  {typeLabels[item.type] ?? item.type}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.textMuted,
                  fontFamily: "Onest",
                }}
              >
                {new Date(item.respondedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
