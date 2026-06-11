import { ClientCard } from "@/components/client";
import { AppHeader } from "@/components/layout";
import { MOCK_AGENCIES, MOCK_FORECASTS, formatDate } from "@/data/mockData";
import { useAuthStore, useClientsStore } from "@/store";
import type { ClientStatus } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FILTER_TABS: { label: string; value: ClientStatus | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "En attente", value: "pending" },
  { label: "Confirmés", value: "confirmed" },
  { label: "Annulés", value: "cancelled" },
];

export default function MyClientsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { getByRabatteur } = useClientsStore();
  const [filter, setFilter] = useState<ClientStatus | "all">("all");
  const [search, setSearch] = useState("");

  const allClients = getByRabatteur(user?.id ?? "");

  const filtered = allClients.filter((c) => {
    const matchStatus = filter === "all" || c.status === filter;
    const q = search.toLowerCase();
    const docNum =
      c.document?.type === "passport"
        ? c.document.number
        : c.document?.type === "cin"
          ? c.document.cinNumber
          : "";
    const matchSearch =
      !q ||
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      docNum.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const getAgency = (id: string) => MOCK_AGENCIES.find((a) => a.id === id);
  const getForecast = (id: number) => MOCK_FORECASTS.find((f) => f.id === id);

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Mes clients" showBack showLogout />

      {/* Search + filter bar */}
      <View className="px-4 pt-4 pb-2 bg-white border-b border-slate-100">
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 gap-3">
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un client..."
            placeholderTextColor="#94a3b8"
            className="flex-1 py-3 text-slate-700"
            style={{ fontFamily: "Outfit_400Regular" }}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-2 pt-3 pb-1"
        >
          {FILTER_TABS.map((tab) => {
            const count =
              tab.value === "all"
                ? allClients.length
                : allClients.filter((c) => c.status === tab.value).length;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => setFilter(tab.value)}
                className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${
                  filter === tab.value
                    ? "bg-slate-800 border-slate-800"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${filter === tab.value ? "text-white" : "text-slate-600"}`}
                >
                  {tab.label}
                </Text>
                <View
                  className={`w-5 h-5 rounded-full items-center justify-center ${filter === tab.value ? "bg-white/20" : "bg-slate-100"}`}
                >
                  <Text
                    className={`text-xs font-bold ${filter === tab.value ? "text-white" : "text-slate-500"}`}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-10 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View className="items-center py-16 gap-4">
            <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center">
              <Ionicons name="people-outline" size={36} color="#cbd5e1" />
            </View>
            <Text className="text-slate-400 text-center">
              {search
                ? "Aucun résultat pour votre recherche."
                : "Aucun client dans cette catégorie."}
            </Text>
          </View>
        ) : (
          filtered.map((client) => {
            const forecast = MOCK_FORECASTS.find(
              (f) => f.id === client.forecastId,
            );
            const agency = MOCK_AGENCIES.find((a) => a.id === client.agencyId);
            return (
              <ClientCard
                key={client.id}
                client={client}
                forecastLabel={
                  forecast
                    ? `${forecast.disponibility.airline.name} · ${formatDate(forecast.disponibility.date)}`
                    : undefined
                }
                agencyCity={agency?.city}
                onPress={() =>
                  router.push({
                    pathname: "/rabatteur/client-detail",
                    params: { id: client.id },
                  })
                }
              />
            );
          })
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push("/rabatteur/add-client")}
        className="absolute bottom-8 right-5 w-14 h-14 rounded-full bg-primary-500 items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
