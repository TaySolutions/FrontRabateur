import { Card, StatCard } from "@/components/common";
import { AppHeader } from "@/components/layout";
import { MOCK_FORECASTS, formatDate } from "@/data/mockData";
import {
    useAuthStore,
    useClientsStore,
    usePackageStore,
    useRabatteurStore,
} from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function AgenceDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { clients } = useClientsStore();
  const { rabatteurs } = useRabatteurStore();
  const { getForAgency } = usePackageStore();

  // agencyId comes from the logged-in user's agencyId field
  const agencyId = (user as any)?.agencyId ?? "ag1";
  const myAllocs = getForAgency(agencyId);
  const openAllocs = myAllocs.filter((a) => a.isOpen);

  // Clients linked to this agency
  const myClients = clients.filter((c) => c.agencyId === agencyId);
  const pending = myClients.filter((c) => c.status === "pending").length;
  const confirmed = myClients.filter((c) => c.status === "confirmed").length;

  // Total seats allocated vs used
  const totalAllocated = myAllocs.reduce(
    (s: any, a: any) =>
      s + a.allocations.reduce((ss: any, r: any) => ss + r.seatsAllocated, 0),
    0,
  );
  const totalUsed = myAllocs.reduce(
    (s: any, a: any) =>
      s + a.allocations.reduce((ss: any, r: any) => ss + r.seatsUsed, 0),
    0,
  );

  const ACTIONS = [
    {
      label: "Gérer les\nforfaits",
      icon: "airplane-outline",
      color: "bg-teal-500",
      route: "/agence/packages",
    },
    {
      label: "Commissions\nrabatteurs",
      icon: "cash-outline",
      color: "bg-teal-500",
      route: "/agence/commissions",
    },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Espace Agence" showLogout />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-5 pb-12 gap-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={["#0d4f3c", "#065f46"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-4xl p-5 overflow-hidden"
        >
          <View className="absolute -right-4 -top-4 opacity-10">
            <Ionicons name="business" size={110} color="#fff" />
          </View>
          <Text className="text-green-300 text-sm">Agence</Text>
          <Text className="text-white text-2xl font-bold mt-0.5">
            {user?.name}
          </Text>
          <Text className="text-green-400 text-sm mt-0.5">
            Gestion des forfaits et commissions
          </Text>
          <View className="flex-row gap-3 mt-5">
            {[
              {
                label: "Forfaits ouverts",
                value: openAllocs.length,
                color: "bg-white/20",
              },
              {
                label: "Places allouées",
                value: totalAllocated,
                color: "bg-white/15",
              },
              {
                label: "Places utilisées",
                value: totalUsed,
                color: "bg-white/10",
              },
            ].map(({ label, value, color }) => (
              <View
                key={label}
                className={`flex-1 ${color} rounded-2xl p-3 items-center`}
              >
                <Text className="text-white font-bold text-xl">{value}</Text>
                <Text className="text-white/60 text-xs mt-0.5 text-center">
                  {label}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Stats */}
        <View className="flex-row gap-3">
          <StatCard
            label="Pèlerins total"
            value={myClients.length}
            icon={<Ionicons name="people-outline" size={20} color="#0087b8" />}
            color="blue"
          />
          <StatCard
            label="Confirmés"
            value={confirmed}
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

        {/* Quick actions */}
        <View>
          <Text className="text-slate-700 font-semibold text-base mb-3">
            Actions rapides
          </Text>
          <View className="flex-row gap-3">
            {ACTIONS.map(({ label, icon, color, route }) => (
              <TouchableOpacity
                key={route}
                onPress={() => router.push(route as any)}
                className={`flex-1 ${color} rounded-3xl p-5 items-center gap-3`}
              >
                <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
                  <Ionicons name={icon as any} size={24} color="#fff" />
                </View>
                <Text className="text-white font-bold text-sm text-center">
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Open packages summary */}
        <Card>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-slate-700 font-semibold">
              Forfaits actifs
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/agence/packages" as any)}
            >
              <Text className="text-teal-600 text-sm font-medium">Gérer →</Text>
            </TouchableOpacity>
          </View>
          {openAllocs.length === 0 ? (
            <Text className="text-slate-400 text-base py-2">
              Aucun forfait ouvert. Ouvrez un forfait pour vos rabatteurs.
            </Text>
          ) : (
            openAllocs.map((alloc: any) => {
              const fc = MOCK_FORECASTS.find((f) => f.id === alloc.forecastId);
              const used = alloc.allocations.reduce(
                (s: any, r: any) => s + r.seatsUsed,
                0,
              );
              const allocated = alloc.allocations.reduce(
                (s: any, r: any) => s + r.seatsAllocated,
                0,
              );
              return (
                <TouchableOpacity
                  key={alloc.id}
                  onPress={() =>
                    router.push({
                      pathname: "/agence/package-detail" as any,
                      params: { id: alloc.id },
                    })
                  }
                  className="flex-row items-center gap-3 py-3 border-b border-slate-50"
                >
                  <View className="w-10 h-10 rounded-2xl bg-green-100 items-center justify-center">
                    <Text style={{ fontSize: 20 }}>✈️</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-700 font-semibold">
                      {fc
                        ? formatDate(fc.disponibility.date)
                        : alloc.forecastId}
                    </Text>
                    <Text className="text-slate-400 text-sm">
                      {fc?.disponibility.airline.name}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-slate-700 font-bold">
                      {used}/{allocated}
                    </Text>
                    <Text className="text-slate-400 text-xs">places</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </Card>

        {/* Rabatteur activity */}
        <Card>
          <Text className="text-slate-700 font-semibold mb-3">
            Activité rabatteurs
          </Text>
          {myAllocs.flatMap((a: any) => a.allocations).length === 0 ? (
            <Text className="text-slate-400 text-base">
              Aucune allocation pour le moment.
            </Text>
          ) : (
            myAllocs
              .flatMap((a: any) => a.allocations)
              .map((r: any) => (
                <View
                  key={r.rabatteurId + "-" + Math.random()}
                  className="flex-row items-center gap-3 py-2.5 border-b border-slate-50"
                >
                  <View className="w-9 h-9 rounded-full bg-teal-100 items-center justify-center">
                    <Text className="text-teal-700 font-bold text-sm">
                      {r.rabatteurName.charAt(0)}
                    </Text>
                  </View>
                  <Text className="text-slate-700 font-medium flex-1">
                    {r.rabatteurName}
                  </Text>
                  <View className="bg-slate-100 rounded-xl px-3 py-1">
                    <Text className="text-slate-600 text-sm font-semibold">
                      {r.seatsUsed}/{r.seatsAllocated} places
                    </Text>
                  </View>
                </View>
              ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
}
