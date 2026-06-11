import { AppHeader } from "@/components/layout";
import { MOCK_FORECASTS, formatDate } from "@/data/mockData";
import { useAuthStore, usePackageStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AgencePackagesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    getForAgency,
    createAllocation,
    toggleOpen,
    getAllocationForForecastAgency,
  } = usePackageStore();
  const agencyId = (user as any)?.agencyId ?? "ag1";
  const myAllocs = getForAgency(agencyId);

  const handleCreate = (forecastId: number) => {
    Alert.alert(
      "Ouvrir ce forfait ?",
      "Ce forfait sera visible par vos rabatteurs après configuration.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Ouvrir",
          onPress: () => {
            createAllocation(forecastId, agencyId);
            router.push({
              pathname: "/agence/package-detail" as any,
              params: { forecastId: String(forecastId) },
            });
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Gestion des forfaits" showBack showLogout />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-5 pb-12 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-slate-500 text-base">
          Sélectionnez un vol pour l'ouvrir à vos rabatteurs et définir leurs
          quotas de places.
        </Text>

        {MOCK_FORECASTS.map((fc) => {
          const alloc = getAllocationForForecastAgency(fc.id, agencyId);
          const isOpen = alloc?.isOpen ?? false;
          const used =
            alloc?.allocations.reduce((s, r) => s + r.seatsUsed, 0) ?? 0;
          const allocated =
            alloc?.allocations.reduce((s, r) => s + r.seatsAllocated, 0) ?? 0;
          const rabCount = alloc?.allocations.length ?? 0;

          return (
            <View
              key={fc.id}
              className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200"
            >
              {/* Flight header */}
              <View className="flex-row items-center gap-4 p-5">
                <View className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center">
                  <Image
                    source={{ uri: fc.disponibility.airline.logo }}
                    style={{ width: 42, height: 42 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-800 font-bold text-xl">
                    {formatDate(fc.disponibility.date)}
                  </Text>
                  <Text className="text-slate-500 text-base">
                    {fc.disponibility.airline.name}
                  </Text>
                  <Text className="text-slate-400 text-sm mt-0.5">
                    {fc.disponibility.onStock} places au total
                  </Text>
                </View>
                {/* Open/close badge */}
                <View
                  className={`px-3 py-1.5 rounded-full ${alloc ? (isOpen ? "bg-green-100" : "bg-slate-100") : "bg-slate-100"}`}
                >
                  <Text
                    className={`text-sm font-bold ${alloc ? (isOpen ? "text-green-700" : "text-slate-500") : "text-slate-400"}`}
                  >
                    {alloc ? (isOpen ? "Ouvert" : "Fermé") : "Non configuré"}
                  </Text>
                </View>
              </View>

              {/* Stats row */}
              {alloc && (
                <View className="flex-row gap-3 px-5 pb-4 border-b border-slate-100">
                  {[
                    { label: "Rabatteurs", value: rabCount },
                    { label: "Alloués", value: allocated },
                    { label: "Utilisés", value: used },
                    { label: "Restants", value: Math.max(0, allocated - used) },
                  ].map(({ label, value }) => (
                    <View
                      key={label}
                      className="flex-1 items-center bg-slate-50 rounded-2xl py-2"
                    >
                      <Text className="text-slate-800 font-bold text-lg">
                        {value}
                      </Text>
                      <Text className="text-slate-400 text-xs">{label}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Actions */}
              <View className="flex-row gap-2 p-4">
                {!alloc ? (
                  <TouchableOpacity
                    onPress={() => handleCreate(fc.id)}
                    className="flex-1 rounded-2xl overflow-hidden"
                  >
                    <LinearGradient
                      colors={["#0d9488", "#0f766e"]}
                      className="flex-row items-center justify-center gap-2 py-3.5"
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="#fff"
                      />
                      <Text className="text-white font-bold">
                        Ouvrir ce forfait
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/agence/package-detail" as any,
                          params: { id: alloc.id },
                        })
                      }
                      className="flex-1 bg-teal-50 border border-teal-200 rounded-2xl flex-row items-center justify-center gap-2 py-3.5"
                    >
                      <Ionicons
                        name="settings-outline"
                        size={18}
                        color="#0d9488"
                      />
                      <Text className="text-teal-700 font-bold">
                        Configurer
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleOpen(alloc.id)}
                      className={`flex-1 border rounded-2xl flex-row items-center justify-center gap-2 py-3.5 ${isOpen ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}
                    >
                      <Ionicons
                        name={
                          isOpen ? "lock-closed-outline" : "lock-open-outline"
                        }
                        size={18}
                        color={isOpen ? "#d97706" : "#16a34a"}
                      />
                      <Text
                        className={`font-bold ${isOpen ? "text-amber-700" : "text-green-700"}`}
                      >
                        {isOpen ? "Fermer" : "Rouvrir"}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
