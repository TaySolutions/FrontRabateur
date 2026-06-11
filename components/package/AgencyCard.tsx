import type { Agency } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AgencyCardProps {
  agency: Agency;
  selected: boolean;
  onSelect: () => void;
}

export function AgencyCard({ agency, selected, onSelect }: AgencyCardProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`rounded-3xl border-2 p-4 mb-3 flex-row items-center gap-3 ${
        selected
          ? "border-primary-500 bg-amber-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <View
        className={`w-12 h-12 rounded-2xl items-center justify-center ${
          selected ? "bg-primary-500" : "bg-slate-100"
        }`}
      >
        <Ionicons
          name="business-outline"
          size={22}
          color={selected ? "#000" : "#64748b"}
        />
      </View>

      <View className="flex-1">
        <Text className="text-slate-800 font-bold">{agency.name}</Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Ionicons name="location-outline" size={12} color="#94a3b8" />
          <Text className="text-slate-400 text-xs">{agency.city}</Text>
        </View>
        <Text className="text-slate-400 text-xs mt-0.5">
          {agency.managerName}
        </Text>
      </View>

      {selected && (
        <View className="bg-primary-500 rounded-full w-6 h-6 items-center justify-center">
          <Ionicons name="checkmark" size={14} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
}
