import React from "react";
import { Text, TextInput, View } from "react-native";

interface InputProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  icon?: React.ReactNode;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  icon,
  error,
  multiline,
  numberOfLines,
}: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-slate-600 font-medium text-sm ml-1">{label}</Text>
      ) : null}
      <View
        className={`flex-row items-center bg-slate-50 border rounded-2xl px-4 gap-3 ${
          error ? "border-danger" : "border-slate-200"
        }`}
      >
        {icon && <View className="opacity-50">{icon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          placeholderTextColor="#94a3b8"
          className="flex-1 py-3.5 text-slate-800 text-base"
          style={{ fontFamily: "Outfit_400Regular" }}
        />
      </View>
      {error ? <Text className="text-danger text-xs ml-1">{error}</Text> : null}
    </View>
  );
}
