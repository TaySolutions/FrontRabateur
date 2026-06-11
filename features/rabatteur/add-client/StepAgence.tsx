import { Card } from "@/components/common";
import { Input } from "@/components/forms";
import { AgencyCard } from "@/components/package";
import { MOCK_AGENCIES } from "@/data/mockData";
import type { useClientForm } from "@/hooks/useClientForm";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = ReturnType<typeof useClientForm>;

export function StepAgence(props: Props) {
  const {
    selectedAgencyId,
    setSelectedAgencyId,
    couponCode,
    setCouponCode,
    notes,
    setNotes,
  } = props;

  return (
    <View className="gap-4">
      <View>
        <Text className="text-xl font-bold text-slate-800">
          Agence & Options
        </Text>
        <Text className="text-slate-400 text-sm mt-0.5">
          Affectez l'agence et les options
        </Text>
      </View>

      <View>
        <Text className="text-slate-700 font-semibold mb-2">Agence *</Text>
        {MOCK_AGENCIES.map((ag) => (
          <AgencyCard
            key={ag.id}
            agency={ag}
            selected={selectedAgencyId === ag.id}
            onSelect={() => setSelectedAgencyId(ag.id)}
          />
        ))}
      </View>

      <Card>
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="pricetag-outline" size={18} color="#F5A623" />
          <Text className="text-slate-700 font-semibold">
            Code coupon (optionnel)
          </Text>
        </View>
        <Input
          label=""
          value={couponCode}
          onChangeText={setCouponCode}
          placeholder="ex: PROMO10"
          icon={<Ionicons name="gift-outline" size={16} color="#94a3b8" />}
        />
      </Card>

      <Input
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Informations complémentaires..."
        multiline
        numberOfLines={3}
        icon={<Ionicons name="chatbox-outline" size={16} color="#94a3b8" />}
      />
    </View>
  );
}
