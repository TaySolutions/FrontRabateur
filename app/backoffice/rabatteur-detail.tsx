import { Badge, Button, Card } from "@/components/common";
import { AppHeader } from "@/components/layout";
import { MOCK_AGENCIES, MOCK_FORECASTS, formatDate } from "@/data/mockData";
import { useClientsStore, useRabatteurStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-start gap-3 py-2.5 border-b border-slate-50">
      <View className="w-7 h-7 rounded-lg bg-slate-50 items-center justify-center mt-0.5">
        <Ionicons name={icon as any} size={14} color="#64748b" />
      </View>
      <View className="flex-1">
        <Text className="text-slate-400 text-xs">{label}</Text>
        <Text className="text-slate-700 font-medium text-sm mt-0.5">
          {value || "—"}
        </Text>
      </View>
    </View>
  );
}

export default function RabatteurDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getById, toggleActive, deleteRabatteur } = useRabatteurStore();
  const { clients } = useClientsStore();

  const rabatteur = getById(id);
  if (!rabatteur) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 gap-4">
        <Ionicons name="alert-circle-outline" size={48} color="#cbd5e1" />
        <Text className="text-slate-400">Rabatteur introuvable.</Text>
        <Button label="Retour" onPress={() => router.back()} variant="ghost" />
      </View>
    );
  }

  const myClients = clients.filter((c) => c.rabatteurId === id);
  const pending = myClients.filter((c) => c.status === "pending").length;
  const confirmed = myClients.filter((c) => c.status === "confirmed").length;
  const cancelled = myClients.filter((c) => c.status === "cancelled").length;

  const assignedAgencies = MOCK_AGENCIES.filter((a) =>
    rabatteur.agencyIds.includes(a.id),
  );

  const handleDelete = () => {
    Alert.alert(
      "Supprimer le rabatteur",
      `Êtes-vous sûr de vouloir supprimer ${rabatteur.firstName} ${rabatteur.lastName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteRabatteur(id);
            router.replace("/backoffice/rabatteurs" as any);
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Profil rabatteur" showBack />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={["#2e1065", "#4c1d95"]}
          className="px-5 pt-5 pb-8"
        >
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 items-center justify-center">
              <Text className="text-white font-bold text-2xl">
                {rabatteur.firstName.charAt(0)}
                {rabatteur.lastName.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-xl">
                {rabatteur.firstName} {rabatteur.lastName}
              </Text>
              <Text className="text-purple-300 text-sm mt-0.5">
                {rabatteur.email}
              </Text>
              <Text className="text-purple-400 text-xs mt-0.5">
                {rabatteur.city}
              </Text>
            </View>
            <View
              className={`px-3 py-1.5 rounded-full ${rabatteur.active ? "bg-green-500/20" : "bg-red-500/20"}`}
            >
              <Text
                className={`text-sm font-semibold ${rabatteur.active ? "text-green-300" : "text-red-300"}`}
              >
                {rabatteur.active ? "Actif" : "Inactif"}
              </Text>
            </View>
          </View>

          {/* KPIs */}
          <View className="flex-row gap-3 mt-5">
            {[
              { label: "Total", value: myClients.length, color: "bg-white/15" },
              { label: "En attente", value: pending, color: "bg-amber-500/25" },
              {
                label: "Confirmés",
                value: confirmed,
                color: "bg-green-500/25",
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

          {/* Timestamps */}
          <View className="flex-row gap-3 mt-3">
            <View className="flex-1 bg-white/5 rounded-2xl px-3 py-2">
              <Text className="text-purple-400 text-xs">Créé le</Text>
              <Text className="text-white text-xs font-medium mt-0.5">
                {format(rabatteur.createdAt, "dd MMM yyyy", { locale: fr })}
              </Text>
            </View>
            <View className="flex-1 bg-white/5 rounded-2xl px-3 py-2">
              <Text className="text-purple-400 text-xs">Mis à jour</Text>
              <Text className="text-white text-xs font-medium mt-0.5">
                {format(rabatteur.updatedAt, "dd MMM yyyy", { locale: fr })}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View className="px-4 pt-5 gap-4">
          {/* Action buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/backoffice/rabatteur-form",
                  params: { id: rabatteur.id },
                } as any)
              }
              className="flex-1 flex-row items-center justify-center gap-2 bg-purple-600 rounded-2xl py-3"
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text className="text-white font-semibold">Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleActive(rabatteur.id)}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3 border-2 ${
                rabatteur.active
                  ? "border-amber-400 bg-amber-50"
                  : "border-green-400 bg-green-50"
              }`}
            >
              <Ionicons
                name={
                  rabatteur.active
                    ? "pause-circle-outline"
                    : "play-circle-outline"
                }
                size={18}
                color={rabatteur.active ? "#d97706" : "#16a34a"}
              />
              <Text
                className={`font-semibold ${rabatteur.active ? "text-amber-600" : "text-green-600"}`}
              >
                {rabatteur.active ? "Désactiver" : "Activer"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="w-12 items-center justify-center bg-red-50 border-2 border-red-300 rounded-2xl py-3"
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* Personal info */}
          <Card className="gap-0">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 rounded-xl bg-purple-100 items-center justify-center">
                <Ionicons name="person" size={16} color="#7c3aed" />
              </View>
              <Text className="text-slate-700 font-bold">
                Informations personnelles
              </Text>
            </View>
            <InfoRow
              icon="call-outline"
              label="Téléphone"
              value={rabatteur.phone}
            />
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={rabatteur.email}
            />
            <InfoRow
              icon="location-outline"
              label="Ville"
              value={rabatteur.city}
            />
            <InfoRow
              icon="document-text-outline"
              label="Numéro de passeport"
              value={rabatteur.passportNumber}
            />
          </Card>

          {/* Agencies */}
          <Card className="gap-0">
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-8 h-8 rounded-xl bg-teal-100 items-center justify-center">
                <Ionicons name="business" size={16} color="#0d9488" />
              </View>
              <Text className="text-slate-700 font-bold">
                Agences assignées
              </Text>
              <View className="bg-teal-100 rounded-full px-2 py-0.5 ml-auto">
                <Text className="text-teal-700 text-xs font-semibold">
                  {assignedAgencies.length}
                </Text>
              </View>
            </View>
            {assignedAgencies.length === 0 ? (
              <Text className="text-slate-400 text-sm py-2">
                Aucune agence assignée.
              </Text>
            ) : (
              assignedAgencies.map((a) => (
                <View
                  key={a.id}
                  className="flex-row items-center gap-3 py-2.5 border-b border-slate-50"
                >
                  <View className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 items-center justify-center">
                    <Ionicons
                      name="business-outline"
                      size={14}
                      color="#0d9488"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-700 font-medium text-sm">
                      {a.name}
                    </Text>
                    <Text className="text-slate-400 text-xs mt-0.5">
                      {a.city} · {a.managerName}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </Card>

          {/* Clients list */}
          <View>
            <Text className="text-slate-700 font-semibold mb-3">
              Clients apportés ({myClients.length})
            </Text>

            {myClients.length === 0 ? (
              <View className="bg-white rounded-3xl p-8 items-center gap-3">
                <Ionicons name="people-outline" size={36} color="#cbd5e1" />
                <Text className="text-slate-400 text-sm text-center">
                  Ce rabatteur n'a encore apporté aucun client.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {myClients.map((c) => {
                  const forecast = MOCK_FORECASTS.find(
                    (f) => f.id === c.forecastId,
                  );
                  return (
                    <Card key={c.id} className="gap-0">
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
                          <Text
                            className="text-slate-400 text-xs mt-0.5"
                            numberOfLines={1}
                          >
                            {c.selectedPriceLabel}
                          </Text>
                          {forecast && (
                            <Text className="text-slate-400 text-xs mt-0.5">
                              {forecast.disponibility.airline.name} ·{" "}
                              {formatDate(forecast.disponibility.date)}
                            </Text>
                          )}
                        </View>
                        <View className="items-end gap-1.5">
                          <Badge status={c.status} />
                          <Text className="text-primary-600 font-bold text-xs">
                            {c.selectedPrice != null
                              ? `${c.selectedPrice.toLocaleString()} TND`
                              : "—"}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-1 mt-2 pt-2 border-t border-slate-50">
                        <Ionicons
                          name="time-outline"
                          size={11}
                          color="#94a3b8"
                        />
                        <Text className="text-slate-400 text-xs">
                          {format(c.createdAt, "dd MMM yyyy · HH:mm", {
                            locale: fr,
                          })}
                        </Text>
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
