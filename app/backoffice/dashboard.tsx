import { Card, StatCard } from "@/components/common";
import { AppHeader } from "@/components/layout";
import { MOCK_AGENCIES } from "@/data/mockData";
import { useAuthStore, useClientsStore, useRabatteurStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function BackofficeDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { rabatteurs } = useRabatteurStore();
  const { clients } = useClientsStore();

  const activeRabatteurs = rabatteurs.filter((r) => r.active).length;
  const inactiveRabatteurs = rabatteurs.filter((r) => !r.active).length;
  const totalClients = clients.length;
  const pendingClients = clients.filter((c) => c.status === "pending").length;

  // Rabatteur activity: sort by most clients
  const rabatteurActivity = rabatteurs
    .map((r) => {
      const rClients = clients.filter((c) => c.rabatteurId === r.id);
      return {
        ...r,
        clientCount: rClients.length,
        confirmed: rClients.filter((c) => c.status === "confirmed").length,
        pending: rClients.filter((c) => c.status === "pending").length,
      };
    })
    .sort((a, b) => b.clientCount - a.clientCount);

  // Agency distribution
  const agencyLoad = MOCK_AGENCIES.map((a) => ({
    ...a,
    count: rabatteurs.filter((r) => r.agencyIds.includes(a.id)).length,
  }));

  // Recent additions
  const recentRabatteurs = [...rabatteurs]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Backoffice" showLogout />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-5 pb-12 gap-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={["#2e1065", "#4c1d95"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-4xl p-5 overflow-hidden"
        >
          <View className="absolute -right-4 -top-4 opacity-10">
            <Ionicons name="people" size={110} color="#fff" />
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-purple-300 text-sm">Backoffice</Text>
              <Text className="text-white text-2xl font-bold mt-0.5">
                {user?.name}
              </Text>
              <Text className="text-purple-400 text-sm">
                Gestion des rabatteurs
              </Text>
            </View>
            <View className="bg-white/10 rounded-2xl px-3 py-1.5">
              <Text className="text-white text-xs font-medium">
                {format(new Date(), "dd MMM yyyy", { locale: fr })}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3 mt-5">
            {[
              {
                label: "Actifs",
                value: activeRabatteurs,
                color: "bg-green-500/30",
              },
              {
                label: "Inactifs",
                value: inactiveRabatteurs,
                color: "bg-red-500/30",
              },
              { label: "Clients", value: totalClients, color: "bg-white/15" },
            ].map(({ label, value, color }) => (
              <View
                key={label}
                className={`flex-1 ${color} rounded-2xl p-3 items-center`}
              >
                <Text className="text-white font-bold text-xl">{value}</Text>
                <Text className="text-white/60 text-xs mt-0.5">{label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Stats */}
        <View>
          <Text className="text-slate-700 font-semibold text-base mb-3">
            Vue d'ensemble
          </Text>
          <View className="flex-row gap-3">
            <StatCard
              label="Rabatteurs total"
              value={rabatteurs.length}
              icon={
                <Ionicons name="people-outline" size={20} color="#7c3aed" />
              }
              color="purple"
            />
            <StatCard
              label="Actifs"
              value={activeRabatteurs}
              icon={
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#15803d"
                />
              }
              color="green"
            />
          </View>
          <View className="flex-row gap-3 mt-3">
            <StatCard
              label="Clients en attente"
              value={pendingClients}
              icon={<Ionicons name="time-outline" size={20} color="#c67c00" />}
              color="gold"
            />
            <StatCard
              label="Total clients"
              value={totalClients}
              icon={
                <Ionicons name="briefcase-outline" size={20} color="#0087b8" />
              }
              color="blue"
            />
          </View>
        </View>

        {/* Quick action */}
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/backoffice/rabatteur-form" } as any)
          }
          className="overflow-hidden rounded-3xl"
        >
          <LinearGradient
            colors={["#4c1d95", "#7c3aed"]}
            className="flex-row items-center gap-4 p-5"
          >
            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
              <Ionicons name="person-add-outline" size={24} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-base">
                Ajouter un rabatteur
              </Text>
              <Text className="text-purple-200 text-xs mt-0.5">
                Créer un nouveau compte rabatteur
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#c4b5fd" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Rabatteur performance table */}
        <Card>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-slate-700 font-semibold">
              Performance rabatteurs
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/backoffice/rabatteurs" as any)}
            >
              <Text className="text-purple-500 text-sm font-medium">
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {rabatteurActivity.slice(0, 5).map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() =>
                  router.push({
                    pathname: "/backoffice/rabatteur-detail",
                    params: { id: r.id },
                  } as any)
                }
                className="flex-row items-center gap-3"
              >
                {/* Avatar */}
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${r.active ? "bg-purple-100" : "bg-slate-100"}`}
                >
                  <Text
                    className={`font-bold text-sm ${r.active ? "text-purple-600" : "text-slate-400"}`}
                  >
                    {r.firstName.charAt(0)}
                    {r.lastName.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-slate-700 font-semibold text-sm">
                      {r.firstName} {r.lastName}
                    </Text>
                    {!r.active && (
                      <View className="bg-red-50 rounded-full px-2 py-0.5">
                        <Text className="text-red-500 text-xs">Inactif</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-slate-400 text-xs mt-0.5">
                    {r.city}
                  </Text>
                </View>
                <View className="items-end gap-1">
                  <Text className="text-slate-700 font-bold text-sm">
                    {r.clientCount} clients
                  </Text>
                  <View className="flex-row gap-2">
                    <Text className="text-green-500 text-xs">
                      {r.confirmed} ✓
                    </Text>
                    <Text className="text-amber-500 text-xs">
                      {r.pending} ⏳
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Agency distribution */}
        <Card>
          <Text className="text-slate-700 font-semibold mb-3">
            Rabatteurs par agence
          </Text>
          <View className="gap-3">
            {agencyLoad.map((a) => (
              <View key={a.id} className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center">
                  <Ionicons name="business-outline" size={16} color="#64748b" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-700 text-sm font-medium">
                    {a.name}
                  </Text>
                  <Text className="text-slate-400 text-xs">{a.city}</Text>
                </View>
                <View className="bg-purple-100 rounded-full w-7 h-7 items-center justify-center">
                  <Text className="text-purple-600 text-xs font-bold">
                    {a.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent additions */}
        <View>
          <Text className="text-slate-700 font-semibold mb-3">
            Derniers ajoutés
          </Text>
          <View className="gap-3">
            {recentRabatteurs.map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() =>
                  router.push({
                    pathname: "/backoffice/rabatteur-detail",
                    params: { id: r.id },
                  } as any)
                }
              >
                <Card className="gap-0">
                  <View className="flex-row items-center gap-3">
                    <View className="w-11 h-11 rounded-2xl bg-purple-100 items-center justify-center">
                      <Text className="text-purple-600 font-bold">
                        {r.firstName.charAt(0)}
                        {r.lastName.charAt(0)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-800 font-semibold text-sm">
                        {r.firstName} {r.lastName}
                      </Text>
                      <Text className="text-slate-400 text-xs mt-0.5">
                        {r.email}
                      </Text>
                    </View>
                    <View className="items-end gap-1">
                      <View
                        className={`px-2.5 py-0.5 rounded-full ${r.active ? "bg-green-50" : "bg-red-50"}`}
                      >
                        <Text
                          className={`text-xs font-semibold ${r.active ? "text-green-600" : "text-red-500"}`}
                        >
                          {r.active ? "Actif" : "Inactif"}
                        </Text>
                      </View>
                      <Text className="text-slate-400 text-xs">
                        {format(r.createdAt, "dd/MM/yyyy")}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
