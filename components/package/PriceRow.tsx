import type { UmrahForecast } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RoomBadge } from "./RoomBadge";

interface PriceRowProps {
  entry: UmrahForecast["prices"][0];
  selected: boolean;
  onSelect: () => void;
}

export function PriceRow({ entry, selected, onSelect }: PriceRowProps) {
  const p = entry.priceUmrah;

  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`flex-row items-center py-3 px-1 border-b border-slate-50 ${
        selected ? "bg-primary-50 -mx-4 px-5 rounded-2xl" : ""
      }`}
    >
      {/* Checkbox */}
      <View
        className={`w-5 h-5 rounded mr-3 border-2 items-center justify-center ${
          selected ? "bg-primary-500 border-primary-500" : "border-slate-300"
        }`}
      >
        {selected && (
          <Ionicons name="checkmark-outline" size={12} color="#000" />
        )}
      </View>

      {/* Room badge */}
      <View className="mr-3">
        <RoomBadge label={p.arrangementMakkahDesignation} />
      </View>

      {/* Hotels */}
      <View className="flex-row items-center gap-2 flex-1">
        <View className="flex-row items-center gap-1">
          <Text style={{ fontSize: 15 }}>🕋</Text>
          <Text
            className="text-slate-600 text-xs"
            numberOfLines={1}
            style={{ maxWidth: 80 }}
          >
            {p.hotelMakkahName}
          </Text>
        </View>
        <Text className="text-slate-300">·</Text>
        <View className="flex-row items-center gap-1">
          <Text style={{ fontSize: 15 }}>🕌</Text>
          <Text
            className="text-slate-600 text-xs"
            numberOfLines={1}
            style={{ maxWidth: 70 }}
          >
            {p.hotelMadinahName}
          </Text>
        </View>
      </View>

      {/* Price */}
      <Text
        className={`font-bold text-base ml-2 ${
          selected ? "text-primary-600" : "text-slate-700"
        }`}
      >
        {p.price.toLocaleString()}
        <Text className="text-xs font-normal text-slate-400"> TND</Text>
      </Text>
    </TouchableOpacity>
  );
}
