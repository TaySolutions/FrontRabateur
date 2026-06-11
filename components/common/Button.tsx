import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const SIZE_CLASS = { sm: "px-4 py-2", md: "px-6 py-3.5", lg: "px-8 py-4" };
const TEXT_SIZE = { sm: "text-sm", md: "text-base", lg: "text-lg" };
const VARIANT_BG = {
  secondary: "bg-ocean-500",
  danger: "bg-danger",
  ghost: "bg-transparent border border-slate-300",
  success: "bg-success",
};
const VARIANT_TXT = {
  secondary: "text-white",
  danger: "text-white",
  ghost: "text-slate-700",
  success: "text-white",
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const pad = SIZE_CLASS[size];
  const txtSize = TEXT_SIZE[size];
  const base = `rounded-2xl flex-row items-center justify-center gap-2 ${pad}`;
  const fw = fullWidth ? "w-full" : "";
  const dis = disabled ? "opacity-50" : "";

  if (variant === "primary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className={`rounded-2xl overflow-hidden ${fw} ${dis}`}
      >
        <LinearGradient
          colors={["#F5A623", "#e89b1a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`flex-row items-center justify-center gap-2 ${pad}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {icon}
              <Text className={`text-white font-semibold ${txtSize}`}>
                {label}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${VARIANT_BG[variant]} ${fw} ${dis}`}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          {icon}
          <Text className={`font-semibold ${txtSize} ${VARIANT_TXT[variant]}`}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
