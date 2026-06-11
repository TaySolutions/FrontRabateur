import { Badge, Card, StatCard } from "@/components/common";
import { AppHeader } from "@/components/layout";
import { useAuthStore, useClientsStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function RabatteurDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { getByRabatteur } = useClientsStore();

  const myClients = getByRabatteur(user?.id ?? "");
  const pending = myClients.filter((c) => c.status === "pending").length;
  const confirmed = myClients.filter((c) => c.status === "confirmed").length;
  const cancelled = myClients.filter((c) => c.status === "cancelled").length;
  const noPackage = myClients.filter((c) => !c.hasPackage).length;
  const recent = myClients.slice(0, 4);

  const QUICK_ACTIONS = [
    {
      label: "Nouveau\npèlerin",
      icon: "person-add-outline",
      color: "bg-ocean-500",
      route: "/rabatteur/add-client",
    },
    {
      label: "Assigner\nforfait",
      icon: "airplane-outline",
      color: "bg-primary-500",
      route: "/rabatteur/assign-package",
    },
    {
      label: "Mes\npèlerins",
      icon: "list-outline",
      color: "bg-slate-700",
      route: "/rabatteur/my-clients",
    },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title={`Bonjour, ${user?.name?.split(" ")[0]}`} showLogout />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-5 pb-10 gap-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <LinearGradient
          colors={["#0c2340", "#1e3a5f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-4xl p-5 overflow-hidden"
        >
          <View className="absolute -right-4 -top-4 opacity-10">
            <Ionicons name="airplane" size={80} color="#fff" />
          </View>
          <Text className="text-slate-400 text-sm font-medium">
            Tableau de bord
          </Text>
          <Text className="text-white text-2xl font-bold mt-1">
            {user?.name}
          </Text>
          <Text className="text-primary-400 text-sm mt-1">Rabatteur</Text>

          {/* Alert if pilgrims have no package */}
          {noPackage > 0 && (
            <TouchableOpacity
              onPress={() => router.push("/rabatteur/assign-package" as any)}
              className="mt-4 flex-row items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-2xl px-4 py-2.5"
            >
              <Ionicons name="warning-outline" size={18} color="#fbbf24" />
              <Text className="text-amber-300 text-sm flex-1">
                <Text className="font-bold">{noPackage}</Text> pèlerin
                {noPackage > 1 ? "s" : ""} sans forfait → Assigner
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#fbbf24" />
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Stats */}
        <View>
          <Text className="text-slate-700 font-semibold text-base mb-3">
            Mes statistiques
          </Text>
          <View className="flex-row gap-3">
            <StatCard
              label="Total"
              value={myClients.length}
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
              label="Sans forfait"
              value={noPackage}
              icon={
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#b91c1c"
                />
              }
              color="red"
            />
          </View>
        </View>

        {/* Quick actions */}
        <View>
          <Text className="text-slate-700 font-semibold text-base mb-3">
            Actions rapides
          </Text>
          <View className="flex-row gap-3">
            {QUICK_ACTIONS.map(({ label, icon, color, route }) => (
              <TouchableOpacity
                key={route}
                onPress={() => router.push(route as any)}
                className={`flex-1 ${color} rounded-3xl p-4 items-center gap-2`}
              >
                <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
                  <Ionicons name={icon as any} size={24} color="#000" />
                </View>
                <Text className="text-black font-semibold text-sm text-center">
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent activity */}
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-slate-700 font-semibold text-base">
              Activité récente
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/rabatteur/my-clients")}
            >
              <Text className="text-ocean-500 text-sm font-medium">
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {recent.length === 0 ? (
              <View className="bg-white rounded-3xl p-8 items-center gap-3">
                <Ionicons name="people-outline" size={40} color="#cbd5e1" />
                <Text className="text-slate-400 text-sm text-center">
                  Aucun pèlerin pour le moment.{"\n"}Commencez par en ajouter un
                  !
                </Text>
              </View>
            ) : (
              recent.map((client) => (
                <Card key={client.id}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-11 h-11 rounded-2xl bg-slate-100 items-center justify-center">
                        <Text className="text-xl font-bold text-slate-600">
                          {client.firstName.charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-800 font-semibold">
                          {client.firstName} {client.lastName}
                        </Text>
                        <Text className="text-slate-400 text-xs mt-0.5">
                          {client.hasPackage && client.selectedPriceLabel
                            ? client.selectedPriceLabel
                            : "⏳ Sans forfait"}
                        </Text>
                      </View>
                    </View>
                    <Badge status={client.status} />
                  </View>
                  <View className="mt-2 pt-2 border-t border-slate-100 flex-row items-center gap-1">
                    <Ionicons name="time-outline" size={12} color="#94a3b8" />
                    <Text className="text-slate-400 text-xs">
                      {format(client.createdAt, "dd MMM yyyy · HH:mm", {
                        locale: fr,
                      })}
                    </Text>
                    {!client.hasPackage && (
                      <TouchableOpacity
                        onPress={() =>
                          router.push("/rabatteur/assign-package" as any)
                        }
                        className="ml-auto flex-row items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1"
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={12}
                          color="#d97706"
                        />
                        <Text className="text-amber-700 text-xs font-semibold">
                          Assigner forfait
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
