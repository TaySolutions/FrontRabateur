import { Badge, Card } from "@/components/common";
import type { Client } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { Text, View } from "react-native";

interface ClientCardProps {
  client: Client;
  forecastLabel?: string;
  agencyCity?: string;
  onPress?: () => void;
  /** Show "Action requise" badge and rabatteur name (admin view) */
  adminView?: boolean;
}

export function ClientCard({
  client,
  forecastLabel,
  agencyCity,
  onPress,
  adminView = false,
}: ClientCardProps) {
  return (
    <Card onPress={onPress} className="gap-0">
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center">
          <Text className="text-slate-600 font-bold text-lg">
            {client.firstName.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-slate-800 font-bold">
            {client.firstName} {client.lastName}
          </Text>
          {adminView ? (
            <View className="flex-row items-center gap-1 mt-0.5">
              <Ionicons name="person-outline" size={11} color="#94a3b8" />
              <Text className="text-slate-400 text-xs">
                {client.rabatteurName}
              </Text>
            </View>
          ) : (
            <Text className="text-slate-400 text-xs mt-0.5">
              {client.phone}
            </Text>
          )}
        </View>
        <View className="items-end gap-1.5">
          <Badge status={client.status} />
          {onPress && (
            <Ionicons name="chevron-forward" size={14} color="#cbd5e1" />
          )}
        </View>
      </View>

      {/* Info chips */}
      <View className="flex-row gap-2 flex-wrap">
        {client.selectedPriceLabel && (
          <View className="bg-amber-50 rounded-xl px-2.5 py-1 flex-row items-center gap-1">
            <Ionicons name="pricetag-outline" size={11} color="#c67c00" />
            <Text className="text-amber-700 text-xs" numberOfLines={1}>
              {client.selectedPriceLabel}
            </Text>
          </View>
        )}
        {forecastLabel && (
          <View className="bg-blue-50 rounded-xl px-2.5 py-1 flex-row items-center gap-1">
            <Ionicons name="airplane-outline" size={11} color="#0087b8" />
            <Text className="text-blue-700 text-xs">{forecastLabel}</Text>
          </View>
        )}
        {agencyCity && (
          <View className="bg-slate-100 rounded-xl px-2.5 py-1 flex-row items-center gap-1">
            <Ionicons name="business-outline" size={11} color="#64748b" />
            <Text className="text-slate-600 text-xs">{agencyCity}</Text>
          </View>
        )}
        <Text className="text-primary-600 font-bold text-xs self-center">
          {client.selectedPrice.toLocaleString()} TND
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={11} color="#94a3b8" />
          <Text className="text-slate-400 text-xs">
            {format(client.createdAt, "dd MMM yyyy · HH:mm", { locale: fr })}
          </Text>
        </View>
        {client.couponCode && (
          <View className="flex-row items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
            <Ionicons name="pricetag-outline" size={10} color="#16a34a" />
            <Text className="text-green-600 text-xs font-semibold">
              {client.couponCode}
            </Text>
          </View>
        )}
        {adminView && client.status === "pending" && (
          <View className="bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">
            <Text className="text-amber-600 text-xs font-medium">
              Action requise
            </Text>
          </View>
        )}
      </View>

      {/* Cancellation reason */}
      {client.status === "cancelled" && client.cancellationReason && (
        <View className="mt-2 bg-red-50 rounded-xl px-3 py-2 flex-row gap-2">
          <Ionicons name="close-circle-outline" size={14} color="#ef4444" />
          <Text className="text-red-500 text-xs flex-1">
            {client.cancellationReason}
          </Text>
        </View>
      )}
    </Card>
  );
}
