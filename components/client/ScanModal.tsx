import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export function ScanModal({
  visible,
  onClose,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (s: "camera" | "gallery") => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="bg-white rounded-t-4xl p-6 gap-4">
          <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-2" />
          <Text className="text-slate-800 font-bold text-2xl text-center mb-2">
            Scanner le passeport
          </Text>
          {[
            {
              label: "Prendre une photo",
              sub: "Utiliser la caméra",
              icon: "camera-outline" as const,
              action: "camera" as const,
              bg: "#0087b8",
            },
            {
              label: "Depuis la galerie",
              sub: "Choisir une photo",
              icon: "images-outline" as const,
              action: "gallery" as const,
              bg: "#64748b",
            },
          ].map(({ label, sub, icon, action, bg }) => (
            <TouchableOpacity
              key={action}
              onPress={() => onPick(action)}
              className="flex-row items-center gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-5"
            >
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <Ionicons name={icon} size={26} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-800 font-bold text-lg">
                  {label}
                </Text>
                <Text className="text-slate-400 text-base mt-0.5">{sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={onClose}
            className="py-4 bg-slate-100 rounded-2xl items-center mt-1"
          >
            <Text className="text-slate-500 font-semibold text-lg">
              Annuler
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default ScanModal;
