import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
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
