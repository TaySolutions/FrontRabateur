import { useAuthStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showLogout?: boolean;
  right?: React.ReactNode;
}

export function AppHeader({
  title,
  showBack,
  showLogout,
  right,
}: AppHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <LinearGradient colors={["#0f172a", "#1e3a5f"]} className="pt-14 pb-4 px-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 items-center justify-center"
            >
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          <View>
            <Text className="text-white font-bold text-xl tracking-tight">
              Kounouz <Text className="text-primary-500">Travel</Text>
            </Text>
            {title && (
              <Text className="text-slate-400 text-xs mt-0">{title}</Text>
            )}
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {right}
          {showLogout && (
            <TouchableOpacity
              onPress={logout}
              className="w-9 h-9 rounded-full bg-white/10 items-center justify-center"
            >
              <Ionicons name="log-out-outline" size={18} color="#F5A623" />
            </TouchableOpacity>
          )}
          {user && (
            <View className="w-9 h-9 rounded-full bg-primary-500/20 items-center justify-center border border-primary-500/40">
              <Text className="text-primary-400 font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
