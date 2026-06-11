import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface SourcePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onPick: (source: "camera" | "gallery") => void;
}

export function SourcePickerModal({
  visible,
  onClose,
  onPick,
}: SourcePickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        className="flex-1 justify-end bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="bg-white rounded-t-4xl p-6 gap-4">
          <View className="w-10 h-1 bg-slate-200 rounded-full self-center" />
          <Text className="text-slate-800 font-bold text-lg text-center">
            Scanner le passeport
          </Text>

          <TouchableOpacity
            onPress={() => onPick("camera")}
            className="flex-row items-center gap-4 bg-ocean-50 border border-ocean-200 rounded-3xl p-4"
          >
            <View className="w-12 h-12 rounded-2xl bg-ocean-500 items-center justify-center">
              <Ionicons name="camera-outline" size={24} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-bold">
                Prendre une photo
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5">
                Photographiez la page biographique
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onPick("gallery")}
            className="flex-row items-center gap-4 bg-slate-50 border border-slate-200 rounded-3xl p-4"
          >
            <View className="w-12 h-12 rounded-2xl bg-slate-600 items-center justify-center">
              <Ionicons name="images-outline" size={24} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-bold">
                Depuis la galerie
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5">
                Sélectionnez une photo existante
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="py-3 rounded-2xl border border-slate-200 items-center"
          >
            <Text className="text-slate-500 font-medium">Annuler</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
