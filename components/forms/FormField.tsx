import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  showOcr?: boolean;
  icon?: React.ReactNode;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  rtl?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
}

function OcrBadge() {
  return (
    <View className="flex-row items-center gap-1 bg-green-100 rounded-full px-2 py-0.5">
      <Ionicons name="scan-outline" size={10} color="#16a34a" />
      <Text className="text-green-600 text-xs font-semibold">OCR</Text>
    </View>
  );
}

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  showOcr = false,
  icon,
  keyboardType,
  rtl = false,
  multiline = false,
  numberOfLines,
  secureTextEntry,
}: FormFieldProps) {
  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2 ml-1">
        <Text className="text-slate-600 font-medium text-sm">{label}</Text>
        {showOcr && <OcrBadge />}
      </View>
      <View
        className={`flex-row items-center rounded-2xl px-4 gap-3 border ${
          showOcr
            ? "bg-green-50 border-green-300"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        {icon && !rtl && <View style={{ opacity: 0.6 }}>{icon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType ?? "default"}
          secureTextEntry={secureTextEntry}
          placeholderTextColor="#94a3b8"
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlign={rtl ? "right" : "left"}
          style={{
            flex: 1,
            paddingVertical: 14,
            fontSize: 15,
            fontFamily: rtl ? "System" : "Outfit_400Regular",
            color: "#1e293b",
            writingDirection: rtl ? "rtl" : "ltr",
          }}
        />
        {icon && rtl && <View style={{ opacity: 0.6 }}>{icon}</View>}
      </View>
    </View>
  );
}
