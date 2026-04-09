import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "@/lib/auth/context";
import { ThemeProvider } from "@/lib/theme/context";
import { setupNotificationHandlers } from "@/lib/notifications/handlers";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Onest: require("@/assets/fonts/Onest-Regular.ttf"),
    "Onest-Medium": require("@/assets/fonts/Onest-Medium.ttf"),
    "Onest-Bold": require("@/assets/fonts/Onest-Bold.ttf"),
    InriaSerif: require("@/assets/fonts/InriaSerif-Regular.ttf"),
    "InriaSerif-Bold": require("@/assets/fonts/InriaSerif-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    return setupNotificationHandlers();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
