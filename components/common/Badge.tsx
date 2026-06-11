import React from "react";
import { Text, View } from "react-native";

type BadgeVariant = "pending" | "confirmed" | "cancelled" | "info";

const STYLES: Record<BadgeVariant, { bg: string; text: string; dot: string }> =
  {
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    confirmed: {
      bg: "bg-green-50",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    cancelled: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    info: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  };

const LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

interface BadgeProps {
  status: BadgeVariant | string;
}

export function Badge({ status }: BadgeProps) {
  const s = STYLES[status as BadgeVariant] ?? STYLES.info;
  return (
    <View
      className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${s.bg}`}
    >
      <View className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <Text className={`text-xs font-semibold ${s.text}`}>
        {LABELS[status] ?? status}
      </Text>
    </View>
  );
}
