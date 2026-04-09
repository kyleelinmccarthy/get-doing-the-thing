import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useTheme } from "@/lib/theme/context";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.bgCard,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: "Onest",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>●</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>+</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⚙</Text>
          ),
        }}
      />
    </Tabs>
  );
}
