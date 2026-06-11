import { AppHeader } from "@/components/layout";
import { MOCK_FORECASTS, formatDate } from "@/data/mockData";
import { useAuthStore, usePackageStore, useRabatteurStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ─── Safe param helper ────────────────────────────────────────────────────────
// useLocalSearchParams returns string | string[] — always resolve to string | undefined
function asString(v: string | string[] | undefined): string | undefined {
  if (v === undefined || v === null) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default function PackageDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Safe string extraction — avoids "path.split is not a function"
  const id = asString(params.id);
  const fId = asString(params.forecastId);

  const { user } = useAuthStore();
  const agencyId = (user as any)?.agencyId ?? "ag1";

  const {
    allocations,
    setRabatteurSeats,
    removeRabatteur,
    toggleOpen,
    getAllocationForForecastAgency,
  } = usePackageStore();
  const { rabatteurs } = useRabatteurStore();

  // Resolve alloc — by id OR by forecastId (just after createAllocation)
  const alloc = id
    ? allocations.find((a) => a.id === id)
    : fId
      ? getAllocationForForecastAgency(Number(fId), agencyId)
      : undefined;

  const forecast = alloc
    ? MOCK_FORECASTS.find((f) => f.id === alloc.forecastId)
    : null;

  // ── Local seat editing state ─────────────────────────────────────────────
  // Initialise AFTER alloc is known (useEffect keeps it in sync when alloc changes)
  const [seats, setSeats] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!alloc) return;
    setSeats((prev) => {
      const next = { ...prev };
      alloc.allocations.forEach((r) => {
        // Only set if not already locally edited
        if (next[r.rabatteurId] === undefined) {
          next[r.rabatteurId] = String(r.seatsAllocated);
        }
      });
      return next;
    });
  }, [alloc?.id, alloc?.allocations.length]);

  // Rabatteurs active in this agency
  const assignedRabs = rabatteurs.filter(
    (r) => r.agencyIds.includes(agencyId) && r.active,
  );
  const allocatedIds = alloc?.allocations.map((r) => r.rabatteurId) ?? [];
  const availableToAdd = assignedRabs.filter(
    (r) => !allocatedIds.includes(r.id),
  );

  // ── Actions ──────────────────────────────────────────────────────────────
  const saveSeats = (rabatteurId: string, rabatteurName: string) => {
    if (!alloc) return;
    const raw = seats[rabatteurId] ?? "0";
    const s = parseInt(raw, 10);
    if (isNaN(s) || s < 0) {
      Alert.alert("", "Entrez un nombre valide.");
      return;
    }
    setRabatteurSeats(alloc.id, rabatteurId, rabatteurName, s);
    Alert.alert("✅", "Quota mis à jour.");
  };

  const handleAdd = (rabatteurId: string, rabatteurName: string) => {
    if (!alloc) return;
    setSeats((prev) => ({ ...prev, [rabatteurId]: "0" }));
    setRabatteurSeats(alloc.id, rabatteurId, rabatteurName, 0);
  };

  const handleRemove = (rabatteurId: string, name: string) => {
    if (!alloc) return;
    Alert.alert("Retirer ce rabatteur ?", `${name} ne verra plus ce forfait.`, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Retirer",
        style: "destructive",
        onPress: () => {
          removeRabatteur(alloc.id, rabatteurId);
          setSeats((prev) => {
            const next = { ...prev };
            delete next[rabatteurId];
            return next;
          });
        },
      },
    ]);
  };

  const increment = (rabatteurId: string, delta: 1 | -1) => {
    setSeats((prev) => {
      const cur = parseInt(prev[rabatteurId] ?? "0", 10);
      return { ...prev, [rabatteurId]: String(Math.max(0, cur + delta)) };
    });
  };

  // ── Not found ────────────────────────────────────────────────────────────
  if (!alloc || !forecast) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center gap-4">
        <Ionicons name="alert-circle-outline" size={48} color="#cbd5e1" />
        <Text className="text-slate-400 text-lg">Forfait introuvable.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-slate-200 rounded-2xl px-6 py-3"
        >
          <Text className="text-slate-600 font-semibold">Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Quotas par rabatteur" showBack />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-5 pb-12 gap-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Forecast header */}
        <View className="bg-white rounded-3xl p-5 shadow-sm flex-row items-center gap-4">
          <View className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center">
            <Image
              source={{ uri: forecast.disponibility.airline.logo }}
              style={{ width: 42, height: 42 }}
              resizeMode="contain"
            />
          </View>
          <View className="flex-1">
            <Text className="text-slate-800 font-bold text-xl">
              {formatDate(forecast.disponibility.date)}
            </Text>
            <Text className="text-slate-500 text-base">
              {forecast.disponibility.airline.name}
            </Text>
            <Text className="text-slate-400 text-sm">
              {forecast.disponibility.onStock} places totales
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleOpen(alloc.id)}
            className={`px-4 py-2 rounded-2xl border-2 ${
              alloc.isOpen
                ? "border-amber-300 bg-amber-50"
                : "border-green-300 bg-green-50"
            }`}
          >
            <Text
              className={`font-bold text-sm ${
                alloc.isOpen ? "text-amber-700" : "text-green-700"
              }`}
            >
              {alloc.isOpen ? "Fermer" : "Ouvrir"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Open/closed status banner */}
        <View
          className={`rounded-3xl p-4 flex-row gap-3 items-center ${
            alloc.isOpen
              ? "bg-green-50 border border-green-200"
              : "bg-slate-100 border border-slate-200"
          }`}
        >
          <Ionicons
            name={alloc.isOpen ? "lock-open-outline" : "lock-closed-outline"}
            size={22}
            color={alloc.isOpen ? "#16a34a" : "#64748b"}
          />
          <Text
            className={`text-base font-semibold flex-1 ${
              alloc.isOpen ? "text-green-700" : "text-slate-600"
            }`}
          >
            {alloc.isOpen
              ? "Ce forfait est ouvert — visible par les rabatteurs assignés."
              : "Ce forfait est fermé — invisible aux rabatteurs."}
          </Text>
        </View>

        {/* ── Quotas ──────────────────────────────────────────────────── */}
        <View>
          <Text className="text-slate-700 font-bold text-lg mb-3">
            Quotas de places
          </Text>

          {alloc.allocations.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 items-center gap-3 border border-slate-200">
              <Ionicons name="people-outline" size={40} color="#cbd5e1" />
              <Text className="text-slate-400 text-base text-center">
                Aucun rabatteur assigné. Ajoutez-en ci-dessous.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {alloc.allocations.map((r) => {
                const rab = assignedRabs.find((rb) => rb.id === r.rabatteurId);
                const seatVal =
                  seats[r.rabatteurId] ?? String(r.seatsAllocated);
                const pct =
                  r.seatsAllocated > 0
                    ? Math.min(100, (r.seatsUsed / r.seatsAllocated) * 100)
                    : 0;

                return (
                  <View
                    key={r.rabatteurId}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200"
                  >
                    {/* Header */}
                    <View className="flex-row items-center gap-3 mb-4">
                      <View className="w-12 h-12 rounded-2xl bg-teal-100 items-center justify-center">
                        <Text className="text-teal-700 font-bold text-lg">
                          {r.rabatteurName.charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-800 font-bold text-lg">
                          {r.rabatteurName}
                        </Text>
                        {rab && (
                          <Text className="text-slate-400 text-sm">
                            {rab.city} · {rab.phone}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          handleRemove(r.rabatteurId, r.rabatteurName)
                        }
                        className="w-9 h-9 rounded-full bg-red-50 border border-red-200 items-center justify-center"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#ef4444"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Usage bar */}
                    <View className="mb-4">
                      <View className="flex-row justify-between mb-1.5">
                        <Text className="text-slate-500 text-sm">
                          Places utilisées
                        </Text>
                        <Text className="text-slate-700 font-bold text-sm">
                          {r.seatsUsed} / {r.seatsAllocated}
                        </Text>
                      </View>
                      <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </View>
                    </View>

                    {/* Seat stepper */}
                    <View className="flex-row items-center gap-3">
                      <Text className="text-slate-600 font-semibold text-base flex-1">
                        Nouveau quota :
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                          onPress={() => increment(r.rabatteurId, -1)}
                          className="w-10 h-10 rounded-2xl bg-slate-100 items-center justify-center"
                        >
                          <Ionicons name="remove" size={20} color="#64748b" />
                        </TouchableOpacity>

                        <TextInput
                          value={seatVal}
                          onChangeText={(v) =>
                            setSeats((prev) => ({
                              ...prev,
                              [r.rabatteurId]: v,
                            }))
                          }
                          keyboardType="numeric"
                          style={{
                            width: 64,
                            textAlign: "center",
                            fontSize: 20,
                            fontFamily: "Outfit_700Bold",
                            color: "#1e293b",
                            backgroundColor: "#f8fafc",
                            borderWidth: 2,
                            borderColor: "#e2e8f0",
                            borderRadius: 16,
                            paddingVertical: 8,
                          }}
                        />

                        <TouchableOpacity
                          onPress={() => increment(r.rabatteurId, 1)}
                          className="w-10 h-10 rounded-2xl bg-slate-100 items-center justify-center"
                        >
                          <Ionicons name="add" size={20} color="#64748b" />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          saveSeats(r.rabatteurId, r.rabatteurName)
                        }
                        className="bg-teal-500 rounded-2xl px-4 py-2.5"
                      >
                        <Text className="text-white font-bold">Sauver</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Add rabatteur ────────────────────────────────────────────── */}
        {availableToAdd.length > 0 && (
          <View>
            <Text className="text-slate-700 font-bold text-lg mb-3">
              Ajouter un rabatteur
            </Text>
            <View className="gap-3">
              {availableToAdd.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  onPress={() =>
                    handleAdd(r.id, `${r.firstName} ${r.lastName}`)
                  }
                  className="bg-white rounded-3xl p-4 border border-slate-200 flex-row items-center gap-3 shadow-sm"
                >
                  <View className="w-11 h-11 rounded-2xl bg-slate-100 items-center justify-center">
                    <Text className="text-slate-600 font-bold">
                      {r.firstName.charAt(0)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-slate-800 font-semibold">
                      {r.firstName} {r.lastName}
                    </Text>
                    <Text className="text-slate-400 text-sm">
                      {r.city} · {r.phone}
                    </Text>
                  </View>
                  <View className="bg-teal-50 border border-teal-200 rounded-2xl px-3 py-2 flex-row items-center gap-1">
                    <Ionicons name="add" size={16} color="#0d9488" />
                    <Text className="text-teal-700 font-semibold text-sm">
                      Ajouter
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
