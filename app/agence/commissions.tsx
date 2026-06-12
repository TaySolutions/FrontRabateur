import { AppHeader } from "@/components/layout";
import { MOCK_FORECASTS, formatDate } from "@/data/mockData";
import { useAuthStore, useClientsStore, useRabatteurStore } from "@/store";
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

// ─── Commission input row ─────────────────────────────────────────────────────
function CommissionRow({
  clientId,
  clientName,
  status,
  packageLabel,
  price,
  commission,
  onSave,
}: {
  clientId: string;
  clientName: string;
  status: string;
  packageLabel?: string;
  price?: number;
  commission?: number;
  onSave: (clientId: string, amount: number) => void;
}) {
  const [value, setValue] = useState(
    commission != null ? String(commission) : "",
  );
  const [saved, setSaved] = useState(false);

  const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700" },
    confirmed: { bg: "bg-green-50", text: "text-green-700" },
    cancelled: { bg: "bg-red-50", text: "text-red-700" },
  };
  const STATUS_LABELS: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmé",
    cancelled: "Annulé",
  };
  const sc = STATUS_COLORS[status] ?? STATUS_COLORS.pending;

  const handleSave = () => {
    const n = parseFloat(value);
    if (isNaN(n) || n < 0) {
      Alert.alert("", "Entrez un montant valide.");
      return;
    }
    onSave(clientId, n);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 gap-3">
      {/* Client row */}
      <View className="flex-row items-center gap-3">
        <View className="w-11 h-11 rounded-2xl bg-slate-100 items-center justify-center">
          <Text className="text-slate-600 font-bold text-lg">
            {clientName.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-slate-800 font-bold text-base">
            {clientName}
          </Text>
          {packageLabel ? (
            <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
              {packageLabel}
            </Text>
          ) : (
            <Text className="text-orange-400 text-xs mt-0.5">
              Forfait non assigné
            </Text>
          )}
        </View>
        <View className={`px-2.5 py-1 rounded-full ${sc.bg}`}>
          <Text className={`text-xs font-semibold ${sc.text}`}>
            {STATUS_LABELS[status]}
          </Text>
        </View>
      </View>

      {/* Price + commission */}
      <View className="flex-row items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
        <View className="flex-1">
          <Text className="text-slate-400 text-xs">Prix total</Text>
          <Text className="text-slate-700 font-bold text-base">
            {price != null ? `${price.toLocaleString()} TND` : "—"}
          </Text>
        </View>

        <View className="w-px h-8 bg-slate-200" />

        <View className="flex-row items-center gap-2 flex-1">
          <View className="flex-1">
            <Text className="text-slate-400 text-xs mb-1">
              Commission (TND)
            </Text>
            <View
              className={`flex-row items-center border-2 rounded-xl px-3 py-1.5 ${saved ? "border-green-400 bg-green-50" : "border-slate-200 bg-white"}`}
            >
              <TextInput
                value={value}
                onChangeText={(v) => {
                  setValue(v);
                  setSaved(false);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#cbd5e1"
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontFamily: "Outfit_700Bold",
                  color: "#1e293b",
                }}
              />
              {saved && (
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSave}
            className={`rounded-xl px-3 py-2.5 mt-4 ${saved ? "bg-green-500" : "bg-teal-500"}`}
          >
            <Text className="text-white font-bold text-sm">
              {saved ? "✓" : "OK"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CommissionsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { clients, setClientCommission } = useClientsStore();
  const { rabatteurs } = useRabatteurStore();
  const agencyId = (user as any)?.agencyId ?? "ag1";

  // Only show clients linked to this agency with a package
  const agencyClients = clients.filter((c) => c.agencyId === agencyId);

  // Group by rabatteur
  const grouped = rabatteurs
    //.filter((r) => r.agencyIds.includes(agencyId))
    .map((r) => ({
      rabatteur: r,
      clients: agencyClients.filter((c) => c.rabatteurId === r.id),
    }))
    .filter((g) => g.clients.length > 0);
  //console.log("grouped", grouped);
  console.log("rabattuer", rabatteurs);
  //console.log("agencyclients", agencyClients);
  const [expanded, setExpanded] = useState<string[]>(
    grouped.map((g) => g.rabatteur.id),
  );

  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const totalCommissions = agencyClients.reduce(
    (s, c) => s + (c.commission ?? 0),
    0,
  );
  const clientsWithCommission = agencyClients.filter(
    (c) => c.commission != null && c.commission > 0,
  ).length;

  const handleSave = (clientId: string, amount: number) => {
    setClientCommission(clientId, amount);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Commissions" showBack showLogout />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-5 pb-12 gap-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Summary banner */}
        <View className="bg-teal-600 rounded-3xl p-5 flex-row items-center gap-4">
          <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
            <Ionicons name="cash-outline" size={28} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="text-teal-200 text-sm">
              Total commissions assignées
            </Text>
            <Text className="text-white font-bold text-3xl mt-0.5">
              {totalCommissions.toLocaleString()} TND
            </Text>
            <Text className="text-teal-300 text-xs mt-0.5">
              {clientsWithCommission} pèlerin
              {clientsWithCommission !== 1 ? "s" : ""} sur{" "}
              {agencyClients.length}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View className="bg-blue-50 border border-blue-200 rounded-3xl p-4 flex-row gap-3">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#0087b8"
          />
          <Text className="text-blue-700 text-sm flex-1 leading-5">
            Saisissez la commission (en TND) que vous versez à chaque rabatteur
            par pèlerin apporté. Appuyez sur{" "}
            <Text className="font-bold">OK</Text> pour enregistrer.
          </Text>
        </View>

        {/* Grouped list */}
        {grouped.length === 0 ? (
          <View className="bg-white rounded-3xl p-10 items-center gap-4">
            <Ionicons name="people-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-400 text-lg text-center">
              Aucun pèlerin assigné à cette agence pour le moment.
            </Text>
          </View>
        ) : (
          grouped.map(({ rabatteur, clients: rc }) => {
            const isOpen = expanded.includes(rabatteur.id);
            const rabTotal = rc.reduce((s, c) => s + (c.commission ?? 0), 0);
            const confirmedCount = rc.filter(
              (c) => c.status === "confirmed",
            ).length;

            return (
              <View key={rabatteur.id} className="gap-3">
                {/* Rabatteur header — collapsible */}
                <TouchableOpacity
                  onPress={() => toggle(rabatteur.id)}
                  className="bg-slate-800 rounded-3xl p-4 flex-row items-center gap-3"
                  activeOpacity={0.85}
                >
                  <View className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 items-center justify-center">
                    <Text className="text-teal-300 font-bold text-lg">
                      {rabatteur.firstName.charAt(0)}
                      {rabatteur.lastName.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-bold text-base">
                      {rabatteur.firstName} {rabatteur.lastName}
                    </Text>
                    <View className="flex-row gap-3 mt-0.5">
                      <Text className="text-slate-400 text-xs">
                        {rc.length} pèlerin{rc.length !== 1 ? "s" : ""}
                      </Text>
                      <Text className="text-slate-400 text-xs">·</Text>
                      <Text className="text-green-400 text-xs">
                        {confirmedCount} confirmé
                        {confirmedCount !== 1 ? "s" : ""}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end gap-1">
                    <Text className="text-teal-400 font-bold text-base">
                      {rabTotal.toLocaleString()} TND
                    </Text>
                    <Text className="text-slate-500 text-xs">comm. totale</Text>
                  </View>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#94a3b8"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>

                {/* Client rows */}
                {isOpen && (
                  <View className="gap-3 pl-1">
                    {rc.map((c) => {
                      const forecast = c.forecastId
                        ? MOCK_FORECASTS.find((f) => f.id === c.forecastId)
                        : null;
                      const packageLabel = c.selectedPriceLabel
                        ? `${c.selectedPriceLabel}${forecast ? " · " + formatDate(forecast.disponibility.date) : ""}`
                        : undefined;
                      return (
                        <CommissionRow
                          key={c.id}
                          clientId={c.id}
                          clientName={`${c.firstName} ${c.lastName}`}
                          status={c.status}
                          packageLabel={packageLabel}
                          price={c.selectedPrice}
                          commission={c.commission}
                          onSave={handleSave}
                        />
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
