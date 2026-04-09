import { View, Text, FlatList } from "react-native";
import { useTheme } from "@/lib/theme/context";
import { ResponseType } from "@doing-the-thing/shared";

interface ResponseItem {
  id: string;
  type: string;
  deferralCount: number;
  respondedAt: Date | string;
}

interface ResponseHistoryProps {
  responses: ResponseItem[];
}

const typeLabels: Record<string, string> = {
  [ResponseType.COMPLETED]: "Did the thing",
  [ResponseType.IN_PROGRESS]: "Doing the thing",
  [ResponseType.DEFERRED]: "Deferred",
  [ResponseType.CHECKIN_COMPLETED]: "Checked in",
};

export function ResponseHistory({ responses }: ResponseHistoryProps) {
  const { colors } = useTheme();

  const dotColors: Record<string, string> = {
    [ResponseType.COMPLETED]: colors.btnDid,
    [ResponseType.IN_PROGRESS]: colors.accent,
    [ResponseType.DEFERRED]: colors.btnCant,
    [ResponseType.CHECKIN_COMPLETED]: colors.accent,
  };

  if (responses.length === 0) {
    return (
      <Text
        style={{ fontSize: 14, color: colors.textMuted, fontFamily: "Onest" }}
      >
        No history yet.
      </Text>
    );
  }

  return (
    <FlatList
      data={responses}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 8,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: dotColors[item.type] ?? "#999",
            }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              color: colors.textPrimary,
              fontFamily: "Onest",
            }}
          >
            {typeLabels[item.type] ?? item.type}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.textMuted,
              fontFamily: "Onest",
            }}
          >
            {new Date(item.respondedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>
        </View>
      )}
    />
  );
}
