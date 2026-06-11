import { Badge, Card, StatCard } from "@/components/common";
import { AppHeader } from "@/components/layout";
import {
  MOCK_AGENCIES,
  MOCK_FORECASTS,
  MOCK_USERS,
  formatDate,
} from "@/data/mockData";
import { useAuthStore, useClientsStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

function MiniBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <View className="h-2 bg-slate-100 rounded-full flex-1 overflow-hidden">
      <View
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </View>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { clients } = useClientsStore();

  const total = clients.length;
  const pending = clients.filter((c) => c.status === "pending").length;
  const confirmed = clients.filter((c) => c.status === "confirmed").length;
  const cancelled = clients.filter((c) => c.status === "cancelled").length;

  const totalRevenue = clients
    .filter((c) => c.status === "confirmed")
    .reduce((sum, c) => sum + (c.selectedPrice ?? 0), 0);

  const rabatteurs = MOCK_USERS.filter((u) => u.role === "rabatteur");
  const rabatteurStats = rabatteurs.map((r) => {
    const rc = clients.filter((c) => c.rabatteurId === r.id);
    return {
      name: r.name,
      total: rc.length,
      confirmed: rc.filter((c) => c.status === "confirmed").length,
      pending: rc.filter((c) => c.status === "pending").length,
    };
  });

  const forecastStats = MOCK_FORECASTS.map((f) => ({
    name: `${f.disponibility.airline.name} · ${formatDate(f.disponibility.date)}`,
    count: clients.filter((c) => c.forecastId === f.id).length,
  }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  const maxForecast = Math.max(...forecastStats.map((f) => f.count), 1);

  const agencyStats = MOCK_AGENCIES.map((a) => ({
    name: a.city,
    count: clients.filter((c) => c.agencyId === a.id).length,
  })).sort((a, b) => b.count - a.count);

  const recent = [...clients]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Administration" showLogout />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-5 pb-12 gap-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={["#0c2340", "#003366"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-4xl p-5 overflow-hidden"
        >
          <View className="absolute -right-4 -top-4 opacity-10">
            <Ionicons name="globe-outline" size={120} color="#fff" />
          </View>
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-slate-400 text-sm">Bienvenue</Text>
              <Text className="text-white text-2xl font-bold mt-0.5">
                {user?.name}
              </Text>
              <Text className="text-primary-400 text-sm">Administrateur</Text>
            </View>
            <View className="bg-white/10 rounded-2xl px-3 py-1.5">
              <Text className="text-white text-xs font-medium">
                {format(new Date(), "dd MMM yyyy", { locale: fr })}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-3 mt-5">
            {[
              { label: "Total", value: total, color: "bg-white/20" },
              { label: "En attente", value: pending, color: "bg-amber-500/30" },
              {
                label: "Confirmés",
                value: confirmed,
                color: "bg-green-500/30",
              },
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

        {/* Stats grid */}
        <View>
          <Text className="text-slate-700 font-semibold text-base mb-3">
            Vue d'ensemble
          </Text>
          <View className="flex-row gap-3">
            <StatCard
              label="Total"
              value={total}
              icon={
                <Ionicons name="people-outline" size={20} color="#0087b8" />
              }
              color="blue"
            />
            <StatCard
              label="En attente"
              value={pending}
              icon={<Ionicons name="time-outline" size={20} color="#c67c00" />}
              color="gold"
            />
          </View>
          <View className="flex-row gap-3 mt-3">
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
            <StatCard
              label="Annulés"
              value={cancelled}
              icon={
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color="#b91c1c"
                />
              }
              color="red"
            />
          </View>
        </View>

        {/* Revenue */}
        <LinearGradient
          colors={["#c67c00", "#F5A623"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-3xl p-5"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-amber-100 text-sm">Chiffre d'affaires</Text>
              <Text className="text-white font-bold text-3xl mt-1">
                {totalRevenue.toLocaleString()} TND
              </Text>
              <Text className="text-amber-200 text-xs mt-1">
                Basé sur {confirmed} dossier{confirmed !== 1 ? "s" : ""}{" "}
                confirmé{confirmed !== 1 ? "s" : ""}
              </Text>
            </View>
            <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
              <Ionicons name="trending-up-outline" size={28} color="#fff" />
            </View>
          </View>
        </LinearGradient>

        {/* Rabatteur performance */}
        <Card>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-slate-700 font-semibold">
              Performance rabatteurs
            </Text>
            <View className="bg-ocean-50 rounded-full px-2 py-0.5">
              <Text className="text-ocean-600 text-xs font-medium">
                {rabatteurs.length} actifs
              </Text>
            </View>
          </View>
          <View className="gap-4">
            {rabatteurStats.map((r) => (
              <View key={r.name}>
                <View className="flex-row items-center justify-between mb-1.5">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 rounded-full bg-ocean-100 items-center justify-center">
                      <Text className="text-ocean-600 font-bold text-sm">
                        {r.name.charAt(0)}
                      </Text>
                    </View>
                    <Text className="text-slate-700 font-medium text-sm">
                      {r.name}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-green-500 text-xs font-medium">
                      {r.confirmed} ✓
                    </Text>
                    <Text className="text-amber-500 text-xs font-medium">
                      {r.pending} ⏳
                    </Text>
                    <Text className="text-slate-400 text-xs">
                      {r.total} total
                    </Text>
                  </View>
                </View>
                <View className="flex-row gap-1 h-2">
                  {r.total > 0 ? (
                    <>
                      <View
                        className="bg-success h-full rounded-full"
                        style={{ flex: r.confirmed }}
                      />
                      <View
                        className="bg-amber-400 h-full rounded-full"
                        style={{ flex: r.pending }}
                      />
                      <View
                        className="bg-slate-200 h-full rounded-full"
                        style={{
                          flex: Math.max(0, r.total - r.confirmed - r.pending),
                        }}
                      />
                    </>
                  ) : (
                    <View className="flex-1 bg-slate-100 rounded-full" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Forecast popularity */}
        <Card>
          <Text className="text-slate-700 font-semibold mb-4">
            Vols les plus demandés
          </Text>
          <View className="gap-3">
            {forecastStats.map((f, i) => (
              <View key={f.name} className="flex-row items-center gap-3">
                <Text className="text-slate-400 text-xs font-bold w-6 text-center">
                  #{i + 1}
                </Text>
                <Text
                  className="text-slate-600 text-sm flex-1"
                  numberOfLines={1}
                >
                  {f.name}
                </Text>
                <MiniBar
                  value={f.count}
                  max={maxForecast}
                  color="bg-ocean-400"
                />
                <Text className="text-slate-500 text-xs w-6 text-right">
                  {f.count}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Agency load */}
        <Card>
          <Text className="text-slate-700 font-semibold mb-3">
            Charge par agence
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {agencyStats.map((a) => (
              <View
                key={a.name}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 flex-row items-center gap-2"
              >
                <Ionicons name="business-outline" size={14} color="#64748b" />
                <Text className="text-slate-600 text-sm">{a.name}</Text>
                <View className="bg-ocean-100 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-ocean-600 text-xs font-bold">
                    {a.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent */}
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-slate-700 font-semibold">
              Activité récente
            </Text>
            <TouchableOpacity onPress={() => router.push("/admin/clients")}>
              <Text className="text-ocean-500 text-sm font-medium">
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {recent.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() =>
                  router.push({
                    pathname: "/admin/client-detail",
                    params: { id: c.id },
                  })
                }
              >
                <Card className="gap-0">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center">
                      <Text className="text-slate-600 font-bold">
                        {c.firstName.charAt(0)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-800 font-semibold text-sm">
                        {c.firstName} {c.lastName}
                      </Text>
                      <Text className="text-slate-400 text-xs mt-0.5">
                        Via {c.rabatteurName}
                      </Text>
                    </View>
                    <View className="items-end gap-1">
                      <Badge status={c.status} />
                      <Text className="text-slate-400 text-xs">
                        {format(c.createdAt, "dd/MM HH:mm")}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => router.push("/admin/clients")}
          className="bg-slate-800 rounded-3xl p-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-2xl bg-white/10 items-center justify-center">
              <Ionicons name="people-outline" size={20} color="#F5A623" />
            </View>
            <View>
              <Text className="text-white font-semibold">
                Gérer tous les clients
              </Text>
              <Text className="text-slate-400 text-xs">
                {pending} en attente de traitement
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
