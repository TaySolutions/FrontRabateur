import { Card } from "@/components/common";
import { AppHeader } from "@/components/layout";
import { MOCK_AGENCIES } from "@/data/mockData";
import { useClientsStore, useRabatteurStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const FILTERS = [
  { label: "Tous", value: "all" },
  { label: "Actifs", value: "active" },
  { label: "Inactifs", value: "inactive" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

export default function RabatteurListScreen() {
  const router = useRouter();
  const { rabatteurs, deleteRabatteur, toggleActive } = useRabatteurStore();
  const { clients } = useClientsStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = rabatteurs.filter((r) => {
    const matchStatus =
      filter === "all" ||
      (filter === "active" && r.active) ||
      (filter === "inactive" && !r.active);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.city.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: rabatteurs.length,
    active: rabatteurs.filter((r) => r.active).length,
    inactive: rabatteurs.filter((r) => !r.active).length,
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Supprimer le rabatteur",
      `Êtes-vous sûr de vouloir supprimer ${name} ? Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteRabatteur(id),
        },
      ],
    );
  };

  const getAgencyNames = (ids: string[]) =>
    ids
      .map((id) => MOCK_AGENCIES.find((a) => a.id === id)?.city ?? id)
      .join(", ");

  const getClientCount = (id: string) =>
    clients.filter((c) => c.rabatteurId === id).length;

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Rabatteurs" showBack showLogout />

      {/* Toolbar */}
      <View className="bg-white border-b border-slate-100 px-4 pt-4 pb-2 gap-3">
        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 gap-3">
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Nom, email, ville, téléphone..."
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
          {FILTERS.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setFilter(tab.value)}
              className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${
                filter === tab.value
                  ? "bg-purple-700 border-purple-700"
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
                  {counts[tab.value]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text className="text-slate-400 text-xs pb-1">
          {filtered.length} rabatteur{filtered.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-4 pb-28 gap-3"
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View className="items-center py-16 gap-4">
            <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center">
              <Ionicons name="people-outline" size={36} color="#cbd5e1" />
            </View>
            <Text className="text-slate-400 text-center">
              Aucun rabatteur trouvé.
            </Text>
          </View>
        ) : (
          filtered.map((r) => (
            <Card key={r.id} className="gap-0">
              {/* Header row */}
              <View className="flex-row items-center gap-3 mb-3">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/backoffice/rabatteur-detail",
                      params: { id: r.id },
                    } as any)
                  }
                  className="flex-row items-center gap-3 flex-1"
                >
                  <View
                    className={`w-12 h-12 rounded-2xl items-center justify-center ${r.active ? "bg-purple-100" : "bg-slate-100"}`}
                  >
                    <Text
                      className={`font-bold text-lg ${r.active ? "text-purple-600" : "text-slate-400"}`}
                    >
                      {r.firstName.charAt(0)}
                      {r.lastName.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-bold">
                      {r.firstName} {r.lastName}
                    </Text>
                    <Text className="text-slate-400 text-xs mt-0.5">
                      {r.email}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Active badge */}
                <View
                  className={`px-2.5 py-1 rounded-full ${r.active ? "bg-green-50" : "bg-red-50"}`}
                >
                  <Text
                    className={`text-xs font-semibold ${r.active ? "text-green-600" : "text-red-500"}`}
                  >
                    {r.active ? "Actif" : "Inactif"}
                  </Text>
                </View>
              </View>

              {/* Info chips */}
              <View className="flex-row flex-wrap gap-2 mb-3">
                <View className="flex-row items-center gap-1 bg-slate-100 rounded-xl px-2.5 py-1">
                  <Ionicons name="call-outline" size={11} color="#64748b" />
                  <Text className="text-slate-600 text-xs">{r.phone}</Text>
                </View>
                <View className="flex-row items-center gap-1 bg-slate-100 rounded-xl px-2.5 py-1">
                  <Ionicons name="location-outline" size={11} color="#64748b" />
                  <Text className="text-slate-600 text-xs">{r.city}</Text>
                </View>
                <View className="flex-row items-center gap-1 bg-blue-50 rounded-xl px-2.5 py-1">
                  <Ionicons name="people-outline" size={11} color="#0087b8" />
                  <Text className="text-blue-600 text-xs">
                    {getClientCount(r.id)} clients
                  </Text>
                </View>
              </View>

              {/* Agency assignment */}
              <View className="bg-slate-50 rounded-2xl px-3 py-2 mb-3 flex-row items-center gap-2">
                <Ionicons name="business-outline" size={13} color="#94a3b8" />
                <Text
                  className="text-slate-500 text-xs flex-1"
                  numberOfLines={1}
                >
                  {r.agencyIds.length > 0
                    ? getAgencyNames(r.agencyIds)
                    : "Aucune agence assignée"}
                </Text>
              </View>

              {/* Actions */}
              <View className="flex-row gap-2 pt-2 border-t border-slate-100">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/backoffice/rabatteur-detail",
                      params: { id: r.id },
                    } as any)
                  }
                  className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <Ionicons name="eye-outline" size={15} color="#64748b" />
                  <Text className="text-slate-600 text-xs font-medium">
                    Détail
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/backoffice/rabatteur-form",
                      params: { id: r.id },
                    } as any)
                  }
                  className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-50 border border-purple-200"
                >
                  <Ionicons name="create-outline" size={15} color="#7c3aed" />
                  <Text className="text-purple-600 text-xs font-medium">
                    Modifier
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleActive(r.id)}
                  className={`flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-xl border ${r.active ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}
                >
                  <Ionicons
                    name={
                      r.active ? "pause-circle-outline" : "play-circle-outline"
                    }
                    size={15}
                    color={r.active ? "#d97706" : "#16a34a"}
                  />
                  <Text
                    className={`text-xs font-medium ${r.active ? "text-amber-600" : "text-green-600"}`}
                  >
                    {r.active ? "Désactiver" : "Activer"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    handleDelete(r.id, `${r.firstName} ${r.lastName}`)
                  }
                  className="w-9 items-center justify-center py-2 rounded-xl bg-red-50 border border-red-200"
                >
                  <Ionicons name="trash-outline" size={15} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: "/backoffice/rabatteur-form" } as any)
        }
        className="absolute bottom-8 right-5 w-14 h-14 rounded-full bg-purple-600 items-center justify-center shadow-lg"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
