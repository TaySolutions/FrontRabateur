import { AppHeader } from "@/components/layout";
import { RoomBadge } from "@/components/package";
import {
  MOCK_AGENCIES,
  MOCK_FORECASTS,
  groupPricesByHotel,
} from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { useAuthStore, useClientsStore, usePackageStore } from "@/store";
import type { Client, UmrahForecast } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function Dots({ step, total }: { step: number; total: number }) {
  return (
    <View className="flex-row items-center justify-center gap-3 py-5 bg-white border-b border-slate-100">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 10,
            borderRadius: 5,
            width: i === step ? 32 : 10,
            backgroundColor:
              i < step ? "#22c55e" : i === step ? "#F5A623" : "#e2e8f0",
          }}
        />
      ))}
    </View>
  );
}

export default function AssignPackageScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { clients, assignPackage } = useClientsStore();
  const { getOpenForRabatteur, incrementUsed, getRemainingSeats } =
    usePackageStore();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Selections
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedAlloc, setSelectedAlloc] = useState<{
    forecastId: number;
    agencyId: string;
  } | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [selectedPriceEntry, setSelectedPriceEntry] = useState<
    UmrahForecast["prices"][0] | null
  >(null);
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [sansVisa, setSansVisa] = useState(false);
  const [sansBillet, setSansBillet] = useState(false);

  // Pilgrims without a package for this rabatteur
  const myClients = clients.filter(
    (c) => c.rabatteurId === (user?.id ?? "") && !c.hasPackage,
  );

  // Open packages for this rabatteur
  const openAllocations = getOpenForRabatteur(user?.id ?? "");

  const selectedForecast = selectedAlloc
    ? (MOCK_FORECASTS.find((f) => f.id === selectedAlloc.forecastId) ?? null)
    : null;

  const hotelGroups = selectedForecast
    ? groupPricesByHotel(selectedForecast)
    : [];

  const selectAlloc = (forecastId: number, agencyId: string) => {
    setSelectedAlloc({ forecastId, agencyId });
    setSelectedPriceId(null);
    setSelectedPriceEntry(null);
    setSelectedAgencyId(agencyId); // pre-fill agency
  };

  const selectPrice = (entry: UmrahForecast["prices"][0]) => {
    setSelectedPriceId(entry.priceUmrah.id);
    setSelectedPriceEntry(entry);
  };

  const next = () => {
    if (step === 0 && !selectedClient) {
      Alert.alert("", "Choisissez un pèlerin.");
      return;
    }
    if (step === 1) {
      if (!selectedAlloc) {
        Alert.alert("", "Choisissez un forfait.");
        return;
      }
      if (!selectedPriceId) {
        Alert.alert("", "Choisissez un type de chambre.");
        return;
      }
      if (!selectedAgencyId) {
        Alert.alert("", "Choisissez une agence.");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const submit = async () => {
    if (
      !selectedClient ||
      !selectedAlloc ||
      !selectedPriceEntry ||
      !selectedForecast
    )
      return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const p = selectedPriceEntry.priceUmrah;
    assignPackage(selectedClient.id, {
      forecastId: selectedForecast.id,
      priceOptionId: p.id,
      selectedForecastLabel: `${selectedForecast.disponibility.airline.name} — ${formatDate(selectedForecast.disponibility.date)}`,
      selectedPriceLabel: `${p.arrangementMakkahDesignation} · ${p.hotelMakkahName}`,
      selectedPrice: p.price,
      sansVisa,
      sansBillet,
      agencyId: selectedAgencyId,
    });
    incrementUsed(
      selectedAlloc.forecastId,
      selectedAlloc.agencyId,
      user?.id ?? "",
    );

    setSubmitting(false);
    Alert.alert(
      "✅ Forfait assigné !",
      `${selectedClient.firstName} ${selectedClient.lastName} a été assigné au forfait.`,
      [{ text: "OK", onPress: () => router.replace("/rabatteur/my-clients") }],
    );
  };

  const STEP_LABELS = [
    "Choisir le pèlerin",
    "Choisir le forfait",
    "Confirmation",
  ];
  const agency = MOCK_AGENCIES.find((a) => a.id === selectedAgencyId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <AppHeader title="Assigner un forfait" showBack />
      <Dots step={step} total={3} />

      <View className="px-5 pt-4 pb-2">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
          Étape {step + 1} / 3
        </Text>
        <Text className="text-slate-800 text-2xl font-bold mt-0.5">
          {STEP_LABELS[step]}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-10 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* ── STEP 0: Pick pèlerin ─────────────────────────────────────── */}
        {step === 0 && (
          <View className="gap-3">
            {myClients.length === 0 ? (
              <View className="bg-white rounded-3xl p-10 items-center gap-4 mt-4">
                <Ionicons name="people-outline" size={48} color="#cbd5e1" />
                <Text className="text-slate-500 font-semibold text-lg text-center">
                  Tous vos pèlerins ont déjà un forfait !
                </Text>
                <Text className="text-slate-400 text-base text-center">
                  Ajoutez d'abord un nouveau pèlerin depuis le tableau de bord.
                </Text>
              </View>
            ) : (
              myClients.map((c) => {
                const sel = selectedClient?.id === c.id;
                const docLabel = !c.document
                  ? "Aucun document"
                  : c.document.type === "passport"
                    ? `🛂 ${c.document.number}`
                    : `🪪 ${c.document.cinNumber}`;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedClient(c)}
                    activeOpacity={0.8}
                    className="rounded-3xl p-5 border-2"
                    style={
                      sel
                        ? { borderColor: "#F5A623", backgroundColor: "#fffbeb" }
                        : { borderColor: "#e2e8f0", backgroundColor: "#fff" }
                    }
                  >
                    <View className="flex-row items-center gap-4">
                      <View className="w-14 h-14 rounded-2xl bg-slate-100 items-center justify-center">
                        <Text className="text-slate-600 font-bold text-2xl">
                          {c.firstName.charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-800 font-bold text-xl">
                          {c.firstName} {c.lastName}
                        </Text>
                        <Text className="text-slate-400 text-base mt-0.5">
                          {c.phone}
                        </Text>
                        <Text className="text-slate-400 text-sm mt-0.5">
                          {docLabel}
                        </Text>
                      </View>
                      <View
                        className="w-8 h-8 rounded-full border-2 items-center justify-center"
                        style={
                          sel
                            ? {
                                borderColor: "#F5A623",
                                backgroundColor: "#F5A623",
                              }
                            : { borderColor: "#cbd5e1" }
                        }
                      >
                        {sel && (
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        )}

        {/* ── STEP 1: Choose package → room → agency ───────────────────── */}
        {step === 1 && (
          <View className="gap-5">
            {/* Available packages */}
            <View>
              <Text className="text-slate-700 font-bold text-lg mb-3">
                Forfaits disponibles
              </Text>
              {openAllocations.length === 0 ? (
                <View className="bg-red-50 border border-red-200 rounded-3xl p-6 items-center gap-3">
                  <Ionicons
                    name="lock-closed-outline"
                    size={36}
                    color="#ef4444"
                  />
                  <Text className="text-red-600 font-bold text-lg text-center">
                    Aucun forfait ouvert
                  </Text>
                  <Text className="text-red-400 text-base text-center">
                    L'agence n'a pas encore ouvert de forfait pour vous.
                    Contactez votre agence.
                  </Text>
                </View>
              ) : (
                openAllocations.map((alloc: any) => {
                  const forecast = MOCK_FORECASTS.find(
                    (f) => f.id === alloc.forecastId,
                  );
                  if (!forecast) return null;
                  const rabAlloc = alloc.allocations.find(
                    (r: any) => r.rabatteurId === user?.id,
                  );
                  const remaining = rabAlloc
                    ? rabAlloc.seatsAllocated - rabAlloc.seatsUsed
                    : 0;
                  const selAlloc =
                    selectedAlloc?.forecastId === alloc.forecastId &&
                    selectedAlloc?.agencyId === alloc.agencyId;
                  const agencyName =
                    MOCK_AGENCIES.find((a) => a.id === alloc.agencyId)?.name ??
                    "";
                  return (
                    <TouchableOpacity
                      key={alloc.id}
                      onPress={() =>
                        selectAlloc(alloc.forecastId, alloc.agencyId)
                      }
                      activeOpacity={0.8}
                      className="rounded-3xl border-2 p-5 mb-3"
                      style={
                        selAlloc
                          ? {
                              borderColor: "#00b0f0",
                              backgroundColor: "#e0f7ff",
                            }
                          : { borderColor: "#e2e8f0", backgroundColor: "#fff" }
                      }
                    >
                      <View className="flex-row items-center gap-4">
                        <View className="w-14 h-14 rounded-2xl bg-white border border-slate-100 items-center justify-center">
                          <Image
                            source={{
                              uri: forecast.disponibility.airline.logo,
                            }}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-slate-800 font-bold text-lg">
                            {formatDate(forecast.disponibility.date)}
                          </Text>
                          <Text className="text-slate-500 text-base">
                            {forecast.disponibility.airline.name}
                          </Text>
                          <Text className="text-slate-400 text-sm mt-0.5">
                            {agencyName}
                          </Text>
                        </View>
                        <View className="items-end gap-1">
                          <View
                            className={`px-3 py-1 rounded-full ${remaining > 5 ? "bg-green-100" : "bg-amber-100"}`}
                          >
                            <Text
                              className={`font-bold text-sm ${remaining > 5 ? "text-green-700" : "text-amber-700"}`}
                            >
                              {remaining} places
                            </Text>
                          </View>
                          <View
                            className="w-7 h-7 rounded-full border-2 items-center justify-center"
                            style={
                              selAlloc
                                ? {
                                    borderColor: "#00b0f0",
                                    backgroundColor: "#00b0f0",
                                  }
                                : { borderColor: "#cbd5e1" }
                            }
                          >
                            {selAlloc && (
                              <Ionicons
                                name="checkmark-outline"
                                size={16}
                                color="#000"
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>

            {/* Hotel + room choice */}
            {selectedForecast && (
              <View className="gap-3">
                <View className="h-px bg-slate-200" />
                <Text className="text-slate-700 font-bold text-lg">
                  Choisir un type de chambre
                </Text>
                {hotelGroups.map((group) => (
                  <View
                    key={group.hotelMakkah}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden mb-2"
                  >
                    <View className="flex-row items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-100">
                      <Text style={{ fontSize: 20 }}>🕋</Text>
                      <View className="flex-1">
                        <Text
                          className="text-slate-800 font-bold"
                          numberOfLines={1}
                        >
                          {group.hotelMakkah}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <Text style={{ fontSize: 14 }}>🕌</Text>
                          <Text
                            className="text-slate-400 text-sm"
                            numberOfLines={1}
                          >
                            {group.hotelMadinah}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="px-4 py-1">
                      {group.prices.map((entry) => {
                        const p = entry.priceUmrah;
                        const sel = selectedPriceId === p.id;
                        return (
                          <TouchableOpacity
                            key={entry.id}
                            onPress={() => selectPrice(entry)}
                            activeOpacity={0.8}
                            className={`flex-row items-center py-4 border-b border-slate-50 ${sel ? "bg-primary-50 -mx-4 px-5 rounded-2xl" : ""}`}
                          >
                            <View
                              className={`w-7 h-7 rounded-lg border-2 mr-4 items-center justify-center ${sel ? "bg-primary-500 border-primary-500" : "border-slate-300"}`}
                            >
                              {sel && (
                                <Ionicons
                                  name="checkmark"
                                  size={16}
                                  color="#fff"
                                />
                              )}
                            </View>
                            <RoomBadge label={p.arrangementMakkahDesignation} />
                            <Text className="text-slate-400 text-xs mx-2">
                              ·
                            </Text>
                            <Text
                              className="text-slate-600 text-sm flex-1"
                              numberOfLines={1}
                            >
                              {p.hotelMakkahName}
                            </Text>
                            <Text
                              className={`font-bold text-lg ${sel ? "text-primary-600" : "text-slate-700"}`}
                            >
                              {p.price.toLocaleString()}{" "}
                              <Text className="text-sm font-normal text-slate-400">
                                TND
                              </Text>
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}

                {/* Options */}
                {selectedPriceEntry && (
                  <View className="bg-white rounded-3xl border border-slate-200 p-4 gap-3">
                    <Text className="text-slate-700 font-bold">Options</Text>
                    {[
                      { label: "Sans Visa", val: sansVisa, set: setSansVisa },
                      {
                        label: "Sans Billet",
                        val: sansBillet,
                        set: setSansBillet,
                      },
                    ].map(({ label, val, set }) => (
                      <TouchableOpacity
                        key={label}
                        onPress={() => set(!val)}
                        className="flex-row items-center gap-3"
                      >
                        <View
                          className={`w-7 h-7 rounded-lg border-2 items-center justify-center ${val ? "bg-primary-500 border-primary-500" : "border-slate-300"}`}
                        >
                          {val && (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          )}
                        </View>
                        <Text className="text-slate-600 text-base font-medium">
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Agency (pre-filled, but can change if needed) */}
            {selectedAlloc && (
              <View className="gap-3">
                <View className="h-px bg-slate-200" />
                <Text className="text-slate-700 font-bold text-lg">Agence</Text>
                {MOCK_AGENCIES.filter(
                  (a) => a.id === selectedAlloc.agencyId,
                ).map((ag) => (
                  <View
                    key={ag.id}
                    className="bg-teal-50 border-2 border-teal-400 rounded-3xl p-5 flex-row items-center gap-4"
                  >
                    <View className="w-14 h-14 rounded-2xl bg-teal-500 items-center justify-center">
                      <Ionicons
                        name="business-outline"
                        size={26}
                        color="#fff"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-teal-800 font-bold text-lg">
                        {ag.name}
                      </Text>
                      <Text className="text-teal-600 text-base">{ag.city}</Text>
                    </View>
                    <View className="bg-teal-500 rounded-full w-8 h-8 items-center justify-center">
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── STEP 2: Confirmation ──────────────────────────────────────── */}
        {step === 2 &&
          selectedClient &&
          selectedForecast &&
          selectedPriceEntry && (
            <View className="gap-4">
              <View className="items-center py-4">
                <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-3">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={38}
                    color="#16a34a"
                  />
                </View>
                <Text className="text-2xl font-bold text-slate-800 text-center">
                  Tout est prêt !
                </Text>
              </View>

              {/* Pèlerin */}
              <View className="bg-white rounded-3xl p-5 shadow-sm">
                <Text className="text-slate-400 text-sm mb-2">PÈLERIN</Text>
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-2xl bg-amber-100 items-center justify-center">
                    <Text className="text-amber-700 font-bold text-xl">
                      {selectedClient.firstName.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-slate-800 font-bold text-lg">
                      {selectedClient.firstName} {selectedClient.lastName}
                    </Text>
                    <Text className="text-slate-400">
                      {selectedClient.phone}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Forfait */}
              <View className="bg-white rounded-3xl p-5 shadow-sm gap-3">
                <Text className="text-slate-400 text-sm mb-1">FORFAIT</Text>
                <View className="flex-row items-center gap-3 bg-ocean-50 rounded-2xl p-3">
                  <Image
                    source={{
                      uri: selectedForecast.disponibility.airline.logo,
                    }}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                  <Text className="text-ocean-800 font-bold">
                    {selectedForecast.disponibility.airline.name} —{" "}
                    {formatDate(selectedForecast.disponibility.date)}
                  </Text>
                </View>
                {[
                  [
                    "Chambre",
                    selectedPriceEntry.priceUmrah.arrangementMakkahDesignation,
                  ],
                  [
                    "Hôtel Mecque",
                    selectedPriceEntry.priceUmrah.hotelMakkahName,
                  ],
                  [
                    "Hôtel Médine",
                    selectedPriceEntry.priceUmrah.hotelMadinahName,
                  ],
                  ...(agency ? [["Agence", agency.name]] : []),
                ].map(([k, v]) => (
                  <View
                    key={k}
                    className="flex-row justify-between py-2 border-b border-slate-50"
                  >
                    <Text className="text-slate-400 text-base">{k}</Text>
                    <Text className="text-slate-800 font-semibold text-base">
                      {v}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Price */}
              <LinearGradient
                colors={["#0c2340", "#1e3a5f"]}
                className="rounded-3xl p-5"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-300 text-base">Prix total</Text>
                  <Text className="text-primary-400 font-bold text-3xl">
                    {selectedPriceEntry.priceUmrah.price.toLocaleString()} TND
                  </Text>
                </View>
              </LinearGradient>
            </View>
          )}
      </ScrollView>

      {/* Navigation */}
      <View className="px-4 pb-8 pt-3 bg-white border-t border-slate-100 gap-3">
        {step < 2 ? (
          <TouchableOpacity
            onPress={next}
            className="rounded-3xl overflow-hidden"
          >
            <LinearGradient
              colors={["#F5A623", "#e89b1a"]}
              className="flex-row items-center justify-center gap-3 py-5"
            >
              <Text className="text-white font-bold text-xl">Continuer</Text>
              <Ionicons name="chevron-forward" size={26} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={submit}
            disabled={submitting}
            className="rounded-3xl overflow-hidden"
          >
            <LinearGradient
              colors={["#22c55e", "#16a34a"]}
              className="flex-row items-center justify-center gap-3 py-5"
            >
              {submitting ? (
                <Text className="text-white font-bold text-xl">
                  Assignation…
                </Text>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={26}
                    color="#000"
                  />
                  <Text className="text-white font-bold text-xl">
                    Confirmer le forfait
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
        {step > 0 && (
          <TouchableOpacity
            onPress={() => setStep((s) => s - 1)}
            className="flex-row items-center justify-center gap-2 py-3"
          >
            <Ionicons name="chevron-back" size={20} color="#94a3b8" />
            <Text className="text-slate-400 font-medium text-base">
              Étape précédente
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
