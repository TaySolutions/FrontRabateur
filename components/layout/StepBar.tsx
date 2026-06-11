import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface StepBarProps {
  steps: readonly string[];
  current: number;
}

export function StepBar({ steps, current }: StepBarProps) {
  return (
    <View className="flex-row items-center px-5 py-4 bg-white border-b border-slate-100">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <View className="items-center gap-1">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                i < current
                  ? "bg-success"
                  : i === current
                    ? "bg-primary-500"
                    : "bg-slate-200"
              }`}
            >
              {i < current ? (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={14}
                  color="#008000"
                />
              ) : (
                <Text
                  className={`text-xs font-bold ${
                    i === current ? "text-primary-600" : "text-slate-400"
                  }`}
                >
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              className={`text-xs ${
                i === current
                  ? "text-primary-600 font-semibold"
                  : "text-slate-400"
              }`}
            >
              {label}
            </Text>
          </View>

          {i < steps.length - 1 && (
            <View
              className={`flex-1 h-0.5 mb-4 mx-1 ${
                i < current ? "bg-success" : "bg-slate-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
