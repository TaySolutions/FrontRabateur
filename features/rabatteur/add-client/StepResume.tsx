import { Card } from "@/components/common";
import type { useClientForm } from "@/hooks/useClientForm";
import { formatDate } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = ReturnType<typeof useClientForm>;

export function StepResume(props: Props) {
  const {
    firstName,
    lastName,
    phone,
    email,
    address,
    firstNameAr,
    lastNameAr,
    fatherNameAr,
    passportNumber,
    passportExpiry,
    dateOfBirth,
    gender,
    nationality,
    ocrData,
    selectedForecast,
    selectedPriceEntry,
    selectedAgency,
    sansVisa,
    sansBillet,
    couponCode,
    finalPrice,
  } = props;

  return (
    <View className="gap-4">
      <View>
        <Text className="text-xl font-bold text-slate-800">
          Résumé du dossier
        </Text>
        <Text className="text-slate-400 text-sm mt-0.5">
          Vérifiez avant de soumettre
        </Text>
      </View>

      {/* Identity */}
      <Card>
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-8 h-8 rounded-xl bg-blue-100 items-center justify-center">
            <Ionicons name="person" size={16} color="#0087b8" />
          </View>
          <Text className="text-slate-700 font-semibold">Identité</Text>
        </View>

        {[
          ["Nom complet", `${firstName} ${lastName}`],
          ["Téléphone", phone],
          ["Email", email || "—"],
          ["Adresse", address || "—"],
        ].map(([k, v]) => (
          <View
            key={k}
            className="flex-row justify-between py-1.5 border-b border-slate-50"
          >
            <Text className="text-slate-400 text-sm">{k}</Text>
            <Text className="text-slate-700 text-sm font-medium">{v}</Text>
          </View>
        ))}

        {(firstNameAr || lastNameAr || fatherNameAr) && (
          <View className="mt-2 bg-slate-50 rounded-2xl p-3 gap-1">
            {[
              ["اللقب", lastNameAr],
              ["الاسم", firstNameAr],
              ["اسم الأب", fatherNameAr],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <View key={k} className="flex-row justify-between py-0.5">
                  <Text className="text-slate-400 text-sm">{k}</Text>
                  <Text
                    className="text-slate-700 text-sm font-medium"
                    style={{ fontFamily: "System" }}
                  >
                    {v}
                  </Text>
                </View>
              ))}
          </View>
        )}
      </Card>

      {/* Passport */}
      <Card>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-purple-100 items-center justify-center">
              <Ionicons name="document-text" size={16} color="#7c3aed" />
            </View>
            <Text className="text-slate-700 font-semibold">Passeport</Text>
          </View>
          {ocrData && (
            <View className="flex-row items-center gap-1 bg-green-100 rounded-full px-2 py-1">
              <Ionicons name="scan-outline" size={11} color="#16a34a" />
              <Text className="text-green-600 text-xs font-medium">OCR</Text>
            </View>
          )}
        </View>

        {[
          ["Numéro", passportNumber],
          ["Expiration", passportExpiry],
          ["Naissance", dateOfBirth || "—"],
          [
            "Genre",
            gender === "M" ? "Masculin" : gender === "F" ? "Féminin" : "—",
          ],
          ["Nationalité", nationality || "—"],
        ].map(([k, v]) => (
          <View
            key={k}
            className="flex-row justify-between py-1.5 border-b border-slate-50"
          >
            <Text className="text-slate-400 text-sm">{k}</Text>
            <Text className="text-slate-700 text-sm font-medium">{v}</Text>
          </View>
        ))}
      </Card>

      {/* Voyage */}
      {selectedForecast && selectedPriceEntry && (
        <Card>
          <View className="flex-row items-center gap-2 mb-3">
            <View className="w-8 h-8 rounded-xl bg-amber-100 items-center justify-center">
              <Text style={{ fontSize: 15 }}>✈️</Text>
            </View>
            <Text className="text-slate-700 font-semibold">Voyage</Text>
          </View>

          <View className="flex-row items-center gap-2 mb-3 p-3 bg-slate-50 rounded-2xl">
            <Image
              source={{ uri: selectedForecast.disponibility.airline.logo }}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
            <Text className="text-slate-700 font-semibold text-sm">
              {selectedForecast.disponibility.airline.name} —{" "}
              {formatDate(selectedForecast.disponibility.date)}
            </Text>
          </View>

          {[
            [
              "Type de chambre",
              selectedPriceEntry.priceUmrah.arrangementMakkahDesignation,
            ],
            ["Hôtel La Mecque", selectedPriceEntry.priceUmrah.hotelMakkahName],
            ["Hôtel Médine", selectedPriceEntry.priceUmrah.hotelMadinahName],
            ["Agence", selectedAgency?.name ?? "—"],
            ...(sansVisa ? [["Options", "Sans Visa"]] : []),
            ...(sansBillet ? [["", "Sans Billet"]] : []),
          ].map(([k, v], i) => (
            <View
              key={i}
              className="flex-row justify-between py-1.5 border-b border-slate-50"
            >
              <Text className="text-slate-400 text-sm">{k}</Text>
              <Text
                className="text-slate-700 text-sm font-medium text-right flex-1 ml-4"
                numberOfLines={1}
              >
                {v}
              </Text>
            </View>
          ))}
        </Card>
      )}

      {/* Price */}
      <LinearGradient
        colors={["#0c2340", "#1e3a5f"]}
        className="rounded-3xl p-5"
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-300 text-sm">Prix total</Text>
          <Text className="text-primary-400 font-bold text-2xl">
            {finalPrice.toLocaleString()} TND
          </Text>
        </View>
        {couponCode && (
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="pricetag-outline" size={13} color="#22c55e" />
              <Text className="text-green-400 text-xs">
                Coupon {couponCode}
              </Text>
            </View>
            <Text className="text-green-400 text-xs font-bold">-100 TND</Text>
          </View>
        )}
        <View className="flex-row items-center gap-2 mt-3 bg-white/5 rounded-2xl px-3 py-2">
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#94a3b8"
          />
          <Text className="text-slate-400 text-xs flex-1">
            Dossier soumis en statut EN ATTENTE. L'admin confirmera ou annulera.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
