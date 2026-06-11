import { formatDate, formatDateAr } from "@/lib/utils";
import type { UmrahForecast } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface FlightCardProps {
  forecast: UmrahForecast;
  selected: boolean;
  onSelect: () => void;
}

export function FlightCard({ forecast, selected, onSelect }: FlightCardProps) {
  const dep = forecast.disponibility;
  const minPrice = Math.min(...forecast.prices.map((p) => p.priceUmrah.price));

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`rounded-3xl border-2 p-4 mb-3 ${
        selected ? "border-ocean-500 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <View className="flex-row items-center gap-3">
        {/* Airline logo */}
        <View className="w-12 h-12 rounded-2xl bg-white border border-slate-100 items-center justify-center overflow-hidden">
          <Image
            source={{ uri: dep.airline.logo }}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-slate-800 font-bold text-base">
              {formatDate(dep.date)}
            </Text>
            {selected && (
              <View className="bg-ocean-500 rounded-full w-5 h-5 items-center justify-center">
                <Ionicons name="checkmark" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text
            className="text-slate-400 text-xs mt-0.5"
            style={{ fontFamily: "System" }}
          >
            {formatDateAr(dep.date)}
          </Text>
          <Text className="text-slate-500 text-sm font-medium mt-0.5">
            {dep.airline.name}
          </Text>
        </View>

        <View className="items-end gap-1">
          <View
            className={`px-2 py-1 rounded-lg ${
              selected ? "bg-ocean-100" : "bg-slate-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                selected ? "text-ocean-600" : "text-slate-500"
              }`}
            >
              {dep.onStock} places
            </Text>
          </View>
          {dep.pnr && (
            <Text className="text-slate-400 text-xs">PNR: {dep.pnr}</Text>
          )}
        </View>
      </View>

      {/* Footer: price range */}
      <View className="mt-3 pt-3 border-t border-slate-100 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Ionicons name="pricetag-outline" size={13} color="#94a3b8" />
          <Text className="text-slate-400 text-xs">
            À partir de{" "}
            <Text className="text-primary-600 font-bold">
              {minPrice.toLocaleString()} TND
            </Text>
          </Text>
        </View>
        <Text className="text-slate-400 text-xs">
          {forecast.prices.length} options
        </Text>
      </View>
    </TouchableOpacity>
  );
}
