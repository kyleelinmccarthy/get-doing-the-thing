import { View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckinForm } from "@/components/features/CheckinForm";
import { useTheme } from "@/lib/theme/context";

export default function CheckinScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <CheckinForm
          thingId={id}
          onComplete={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}
