import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface DetailSectionProps {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}

export function DetailSection({
  title,
  icon,
  color,
  children,
}: DetailSectionProps) {
  return (
    <View className="bg-white rounded-3xl p-4 shadow-sm gap-0">
      <View className="flex-row items-center gap-2 mb-2">
        <View
          className={`w-8 h-8 rounded-xl items-center justify-center ${color}`}
        >
          <Ionicons name={icon as any} size={16} color="#fff" />
        </View>
        <Text className="text-slate-700 font-bold">{title}</Text>
      </View>
      {children}
    </View>
  );
}
