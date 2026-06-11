import type { UmrahForecast } from "@/types";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { PriceRow } from "./PriceRow";

interface HotelGroupCardProps {
  hotelMakkah: string;
  hotelMadinah: string;
  prices: UmrahForecast["prices"];
  selectedPriceId: number | null;
  onSelectPrice: (entry: UmrahForecast["prices"][0]) => void;
}

export function HotelGroupCard({
  hotelMakkah,
  hotelMadinah,
  prices,
  selectedPriceId,
  onSelectPrice,
}: HotelGroupCardProps) {
  return (
    <View className="bg-white rounded-3xl border border-slate-200 mb-3 overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-100">
        <View className="flex-row items-center gap-2 flex-1">
          <Text style={{ fontSize: 18 }}>🕋</Text>
          <View className="flex-1">
            <Text
              className="text-slate-800 font-bold text-sm"
              numberOfLines={1}
            >
              {hotelMakkah}
            </Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Text style={{ fontSize: 13 }}>🕌</Text>
              <Text className="text-slate-400 text-xs" numberOfLines={1}>
                {hotelMadinah}
              </Text>
            </View>
          </View>
        </View>
        <View className="bg-slate-100 rounded-full px-2 py-0.5">
          <Text className="text-slate-500 text-xs">
            {prices.length} options
          </Text>
        </View>
      </View>

      {/* Price rows */}
      <View className="px-4 py-1">
        {prices.map((entry) => (
          <ScrollView
            key={entry.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <PriceRow
              key={entry.id}
              entry={entry}
              selected={selectedPriceId === entry.priceUmrah.id}
              onSelect={() => onSelectPrice(entry)}
            />
          </ScrollView>
        ))}
      </View>
    </View>
  );
}
