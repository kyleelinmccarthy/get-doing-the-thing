import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/lib/auth/context";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
