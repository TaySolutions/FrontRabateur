import { ClientCard } from "@/components/client";
import { AppHeader } from "@/components/layout";
import { MOCK_AGENCIES, MOCK_FORECASTS, formatDate } from "@/data/mockData";
import { useClientsStore } from "@/store";
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

export default function AdminClientsScreen() {
  const router = useRouter();
  const { clients } = useClientsStore();
  const [filter, setFilter] = useState<ClientStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  const filtered = clients
    .filter((c) => {
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
        c.rabatteurName.toLowerCase().includes(q) ||
        docNum.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    })
    .sort((a, b) =>
      sortBy === "date"
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : `${a.lastName}${a.firstName}`.localeCompare(
            `${b.lastName}${b.firstName}`,
          ),
    );

  const counts = {
    all: clients.length,
    pending: clients.filter((c) => c.status === "pending").length,
    confirmed: clients.filter((c) => c.status === "confirmed").length,
    cancelled: clients.filter((c) => c.status === "cancelled").length,
  };

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Gestion des clients" showBack showLogout />

      <View className="bg-white border-b border-slate-100 px-4 pt-4 pb-2 gap-3">
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 gap-3">
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Nom, téléphone, document, rabatteur…"
            placeholderTextColor="#94a3b8"
            className="flex-1 py-3 text-slate-700 text-sm"
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
          contentContainerClassName="flex-row gap-2"
        >
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setFilter(tab.value)}
              className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${filter === tab.value ? "bg-slate-800 border-slate-800" : "bg-white border-slate-200"}`}
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
                  {counts[tab.value]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="flex-row items-center justify-between pb-1">
          <Text className="text-slate-400 text-xs">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-slate-400 text-xs">Trier :</Text>
            {(["date", "name"] as const).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setSortBy(s)}
                className={`px-2 py-1 rounded-lg ${sortBy === s ? "bg-ocean-50" : ""}`}
              >
                <Text
                  className={`text-xs font-medium ${sortBy === s ? "text-ocean-600" : "text-slate-400"}`}
                >
                  {s === "date" ? "Date" : "Nom"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
              Aucun client trouvé.
            </Text>
          </View>
        ) : (
          filtered.map((client) => {
            const forecast = client.forecastId
              ? MOCK_FORECASTS.find((f) => f.id === client.forecastId)
              : undefined;
            const agency = client.agencyId
              ? MOCK_AGENCIES.find((a) => a.id === client.agencyId)
              : undefined;
            return (
              <ClientCard
                key={client.id}
                client={client}
                forecastLabel={
                  forecast ? formatDate(forecast.disponibility.date) : undefined
                }
                agencyCity={agency?.city}
                adminView
                onPress={() =>
                  router.push({
                    pathname: "/admin/client-detail",
                    params: { id: client.id },
                  })
                }
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
