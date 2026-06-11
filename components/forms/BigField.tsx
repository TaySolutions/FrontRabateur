import React from "react";
import { Text, TextInput, View } from "react-native";

export function BigField({
  label,
  value,
  onChange,
  placeholder,
  keyboard = "default",
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboard?: any;
  optional?: boolean;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2 ml-1">
        <Text className="text-slate-700 font-semibold text-lg">{label}</Text>
        {optional && (
          <Text className="text-slate-400 text-sm">(optionnel)</Text>
        )}
      </View>
      <View className="bg-white border-2 border-slate-200 rounded-3xl px-5">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          keyboardType={keyboard}
          placeholderTextColor="#cbd5e1"
          style={{
            fontSize: 20,
            fontFamily: "Outfit_400Regular",
            color: "#1e293b",
            paddingVertical: 18,
          }}
        />
      </View>
    </View>
  );
}
