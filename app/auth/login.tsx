import { DEMO_CREDENTIALS } from "@/data/mockData";
import { useAuthStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  backoffice: "/backoffice/dashboard",
  agence: "/agence/dashboard",
  rabatteur: "/rabatteur/dashboard",
};

const SHORTCUTS = [
  {
    key: "admin" as const,
    label: "Admin",
    icon: "shield-checkmark-outline" as const,
    color: "#F5A623",
  },
  {
    key: "backoffice" as const,
    label: "Backoffice",
    icon: "people-circle-outline" as const,
    color: "#a78bfa",
  },
  {
    key: "agence" as const,
    label: "Agence",
    icon: "business-outline" as const,
    color: "#0d9488",
  },
  {
    key: "rabatteur" as const,
    label: "Rabatteur",
    icon: "person-outline" as const,
    color: "#00b0f0",
  },
];

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    const ok = await login(email, password);
    if (ok) {
      const { user } = useAuthStore.getState();
      router.replace((ROLE_HOME[user?.role ?? ""] ?? "/auth/login") as any);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient
        colors={["#0f172a", "#0c2340", "#0f172a"]}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-12"
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 items-center justify-center mb-4">
              <Image
                source={require("@/assets/images/kounouz.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <Text className="text-white text-3xl font-bold">
              Kounouz <Text className="text-primary-500">Travel</Text>
            </Text>
            <Text className="text-slate-400 text-sm mt-1 text-center">
              Système de gestion des pèlerins
            </Text>
          </View>

          {/* Form */}
          <View className="bg-white/5 border border-white/10 rounded-4xl p-6 gap-5">
            <Text className="text-white text-xl font-bold">Connexion</Text>
            <View className="gap-1.5">
              <Text className="text-slate-400 text-sm ml-1">Email</Text>
              <View className="flex-row items-center bg-white/5 border border-white/15 rounded-2xl px-4 gap-3">
                <Ionicons name="mail-outline" size={18} color="#94a3b8" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="votre@email.com"
                  placeholderTextColor="#475569"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-1 py-4 text-white text-base"
                  style={{ fontFamily: "Outfit_400Regular" }}
                />
              </View>
            </View>
            <View className="gap-1.5">
              <Text className="text-slate-400 text-sm ml-1">Mot de passe</Text>
              <View className="flex-row items-center bg-white/5 border border-white/15 rounded-2xl px-4 gap-3">
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#94a3b8"
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#475569"
                  secureTextEntry
                  className="flex-1 py-4 text-white text-base"
                  style={{ fontFamily: "Outfit_400Regular" }}
                />
              </View>
            </View>
            {error && (
              <View className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 flex-row items-center gap-2">
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color="#ef4444"
                />
                <Text className="text-red-400 text-sm">{error}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className="rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={["#F5A623", "#e89b1a"]}
                className="py-4 items-center"
              >
                <Text className="text-white font-bold text-lg">
                  {isLoading ? "Connexion…" : "Se connecter"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Demo shortcuts */}
          <View className="mt-6 gap-3">
            <Text className="text-slate-500 text-center text-xs uppercase tracking-widest">
              Accès démo
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SHORTCUTS.map(({ key, label, icon, color }) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    setEmail(DEMO_CREDENTIALS[key].email);
                    setPassword(DEMO_CREDENTIALS[key].password);
                  }}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 items-center gap-1"
                  style={{ minWidth: "45%" }}
                >
                  <Ionicons name={icon} size={18} color={color} />
                  <Text className="text-slate-300 text-xs font-medium">
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
