import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconBg: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  iconBg,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 mt-2 mb-1">
      <View
        className={`w-9 h-9 rounded-2xl items-center justify-center ${iconBg}`}
      >
        <Ionicons name={icon as any} size={18} color="#000" />
      </View>
      <View>
        <Text className="text-slate-800 font-bold text-base">{title}</Text>
        {subtitle && (
          <Text className="text-slate-400 text-xs mt-0.5">{subtitle}</Text>
        )}
      </View>
    </View>
  );
}
