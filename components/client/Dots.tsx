import React from "react";
import { View } from "react-native";

export function Dots({ step, total }: { step: number; total: number }) {
  return (
    <View className="flex-row items-center justify-center gap-3 py-5 bg-white border-b border-slate-100">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 10,
            borderRadius: 5,
            width: i === step ? 32 : 10,
            backgroundColor:
              i < step ? "#22c55e" : i === step ? "#F5A623" : "#e2e8f0",
          }}
        />
      ))}
    </View>
  );
}
