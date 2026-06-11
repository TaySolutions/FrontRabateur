import { useAuthStore } from "@/store";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  backoffice: "/backoffice/dashboard",
  agence: "/agence/dashboard",
  rabatteur: "/rabatteur/dashboard",
};

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    const inAuth = segments[0] === "auth";
    if (!user && !inAuth) router.replace("/auth/login");
    else if (user && inAuth)
      router.replace((ROLE_HOME[user.role] ?? "/auth/login") as any);
  }, [user, segments]);
  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });
  if (!fontsLoaded)
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator color="#F5A623" size="large" />
      </View>
    );
  return (
    <AuthGuard>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="rabatteur/dashboard" />
        <Stack.Screen name="rabatteur/add-client" />
        <Stack.Screen name="rabatteur/my-clients" />
        <Stack.Screen name="rabatteur/assign-package" />
        <Stack.Screen name="admin/dashboard" />
        <Stack.Screen name="admin/clients" />
        <Stack.Screen name="admin/client-detail" />
        <Stack.Screen name="backoffice/dashboard" />
        <Stack.Screen name="backoffice/rabatteurs" />
        <Stack.Screen name="backoffice/rabatteur-form" />
        <Stack.Screen name="backoffice/rabatteur-detail" />
        <Stack.Screen name="agence/dashboard" />
        <Stack.Screen name="agence/packages" />
        <Stack.Screen name="agence/package-detail" />
        <Stack.Screen name="agence/commissions" />
      </Stack>
    </AuthGuard>
  );
}
