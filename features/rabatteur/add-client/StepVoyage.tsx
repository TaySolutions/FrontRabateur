import { FlightCard, HotelGroupCard } from "@/components/package";
import { MOCK_FORECASTS, groupPricesByHotel } from "@/data/mockData";
import type { useClientForm } from "@/hooks/useClientForm";
import { formatDate } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = ReturnType<typeof useClientForm>;

export function StepVoyage(props: Props) {
  const {
    selectedForecastId,
    selectedForecast,
    selectedPriceId,
    selectedPriceEntry,
    sansVisa,
    setSansVisa,
    sansBillet,
    setSansBillet,
    selectForecast,
    selectPrice,
    clearForecast,
  } = props;

  const hotelGroups = selectedForecast
    ? groupPricesByHotel(selectedForecast)
    : [];

  return (
    <View className="gap-5">
      <View>
        <Text className="text-xl font-bold text-slate-800">
          Vols & Forfaits
        </Text>
        <Text className="text-slate-400 text-sm mt-0.5">
          Choisissez d'abord un vol, puis un type de chambre
        </Text>
      </View>

      {/* Level 1 — Flight */}
      <View>
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-6 h-6 rounded-full bg-ocean-500 items-center justify-center">
            <Text className="text-white text-xs font-bold">1</Text>
          </View>
          <Text className="text-slate-700 font-semibold">Choisir un vol</Text>
        </View>

        {MOCK_FORECASTS.map((fc) => (
          <FlightCard
            key={fc.id}
            forecast={fc}
            selected={selectedForecastId === fc.id}
            onSelect={() => selectForecast(fc)}
          />
        ))}
      </View>

      {/* Level 2 — Room type (appears after flight pick) */}
      {selectedForecast && (
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-6 h-6 rounded-full bg-primary-500 items-center justify-center">
              <Text className="text-white text-xs font-bold">2</Text>
            </View>
            <Text className="text-slate-700 font-semibold">
              Choisir un type de chambre
            </Text>
          </View>

          {/* Selected flight recap */}
          <View className="bg-ocean-50 border border-ocean-200 rounded-2xl px-4 py-3 mb-4 flex-row items-center gap-3">
            <Image
              source={{ uri: selectedForecast.disponibility.airline.logo }}
              style={{ width: 28, height: 28 }}
              resizeMode="contain"
            />
            <View className="flex-1">
              <Text className="text-ocean-800 font-semibold text-sm">
                {formatDate(selectedForecast.disponibility.date)}
              </Text>
              <Text className="text-ocean-600 text-xs">
                {selectedForecast.disponibility.airline.name} ·{" "}
                {selectedForecast.disponibility.onStock} places
              </Text>
            </View>
            <TouchableOpacity onPress={clearForecast}>
              <View className="w-6 h-6 rounded-full bg-ocean-100 items-center justify-center">
                <Ionicons name="close" size={14} color="#0087b8" />
              </View>
            </TouchableOpacity>
          </View>

          {hotelGroups.map((group) => (
            <HotelGroupCard
              key={group.hotelMakkah}
              hotelMakkah={group.hotelMakkah}
              hotelMadinah={group.hotelMadinah}
              prices={group.prices}
              selectedPriceId={selectedPriceId}
              onSelectPrice={selectPrice}
            />
          ))}
        </View>
      )}

      {/* Options */}
      {selectedPriceEntry && (
        <View className="bg-white rounded-3xl border border-slate-200 p-4 gap-3">
          <Text className="text-slate-600 font-semibold text-sm">
            Options supplémentaires
          </Text>
          <View className="flex-row gap-4">
            {[
              { label: "Sans Visa", value: sansVisa, set: setSansVisa },
              { label: "Sans Billet", value: sansBillet, set: setSansBillet },
            ].map(({ label, value, set }) => (
              <TouchableOpacity
                key={label}
                onPress={() => set(!value)}
                className="flex-row items-center gap-2"
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    value
                      ? "bg-primary-500 border-primary-500"
                      : "border-slate-300"
                  }`}
                >
                  {value && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text className="text-slate-600 text-sm">{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Selected price summary */}
      {selectedPriceEntry && (
        <LinearGradient
          colors={["#0c2340", "#1e3a5f"]}
          className="rounded-3xl p-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-slate-400 text-xs mb-1">Sélection</Text>
              <Text className="text-white font-semibold text-sm">
                {selectedPriceEntry.priceUmrah.arrangementMakkahDesignation}
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5" numberOfLines={1}>
                {selectedPriceEntry.priceUmrah.hotelMakkahName} ·{" "}
                {selectedPriceEntry.priceUmrah.hotelMadinahName}
              </Text>
            </View>
            <Text className="text-primary-400 font-bold text-2xl">
              {selectedPriceEntry.priceUmrah.price.toLocaleString()}
              <Text className="text-sm text-slate-400"> TND</Text>
            </Text>
          </View>
        </LinearGradient>
      )}
    </View>
  );
}
