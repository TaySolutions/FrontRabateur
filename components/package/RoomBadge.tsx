import { ROOM_BADGE_COLORS } from "@/constants";
import React from "react";
import { Text, View } from "react-native";

interface RoomBadgeProps {
  label: string;
}

export function RoomBadge({ label }: RoomBadgeProps) {
  const c = ROOM_BADGE_COLORS[label] ?? {
    bg: "#e2e8f0",
    text: "#374151",
    border: "#cbd5e1",
  };
  return (
    <View
      style={{
        backgroundColor: c.bg,
        borderColor: c.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Text style={{ color: c.text, fontSize: 12, fontWeight: "700" }}>
        {label}
      </Text>
    </View>
  );
}
