import React from "react";
import { Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "gold" | "blue" | "green" | "red" | "purple";
  trend?: string;
}

const COLORS = {
  gold: { bg: "bg-amber-50", icon: "bg-amber-100", text: "text-amber-600" },
  blue: { bg: "bg-blue-50", icon: "bg-blue-100", text: "text-blue-600" },
  green: { bg: "bg-green-50", icon: "bg-green-100", text: "text-green-600" },
  red: { bg: "bg-red-50", icon: "bg-red-100", text: "text-red-600" },
  purple: {
    bg: "bg-purple-50",
    icon: "bg-purple-100",
    text: "text-purple-600",
  },
};

export function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  const c = COLORS[color];
  return (
    <View className={`${c.bg} rounded-3xl p-4 flex-1 min-w-36`}>
      <View
        className={`${c.icon} w-10 h-10 rounded-2xl items-center justify-center mb-3`}
      >
        {icon}
      </View>
      <Text className={`text-2xl font-bold ${c.text}`}>{value}</Text>
      <Text className="text-slate-500 text-xs mt-0.5">{label}</Text>
      {trend ? (
        <Text className="text-green-500 text-xs mt-1 font-medium">{trend}</Text>
      ) : null}
    </View>
  );
}
