import { DetailSection, InfoRow } from "@/components/client";
import { Badge, Button, Card } from "@/components/common";
import { AppHeader } from "@/components/layout";
import { RoomBadge } from "@/components/package";
import { MOCK_AGENCIES, MOCK_FORECASTS, formatDate } from "@/data/mockData";
import { useClientsStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Cancel modal ─────────────────────────────────────────────────────────────
function CancelModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (r: string) => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-4xl p-6 gap-5">
          <View className="w-10 h-1 bg-slate-200 rounded-full self-center" />
          <View className="items-center gap-2">
            <View className="w-14 h-14 rounded-full bg-red-100 items-center justify-center">
              <Ionicons name="close-circle-outline" size={30} color="#ef4444" />
            </View>
            <Text className="text-slate-800 font-bold text-xl">
              Annuler le dossier
            </Text>
            <Text className="text-slate-400 text-sm text-center">
              Veuillez indiquer le motif. Cette action est définitive.
            </Text>
          </View>
          <View className="gap-1.5">
            <Text className="text-slate-600 font-medium text-sm ml-1">
              Motif d'annulation *
            </Text>
            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Ex: Le client a changé d'avis…"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                style={{
                  fontFamily: "Outfit_400Regular",
                  color: "#1e293b",
                  fontSize: 15,
                }}
              />
            </View>
          </View>
          <View className="gap-3">
            <Button
              label="Confirmer l'annulation"
              onPress={() => {
                if (!reason.trim()) {
                  Alert.alert("Requis", "Saisissez un motif.");
                  return;
                }
                onConfirm(reason.trim());
                setReason("");
              }}
              variant="danger"
              fullWidth
              size="lg"
            />
            <Button
              label="Retour"
              onPress={onClose}
              variant="ghost"
              fullWidth
              size="lg"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ClientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { clients, updateStatus } = useClientsStore();
  const [cancelModal, setCancelModal] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const client = clients.find((c) => c.id === id);
  const agency = client?.agencyId
    ? MOCK_AGENCIES.find((a) => a.id === client.agencyId)
    : null;
  const forecast = client?.forecastId
    ? MOCK_FORECASTS.find((f) => f.id === client.forecastId)
    : null;
  const priceEntry = forecast?.prices.find(
    (p) => p.priceUmrah.id === client?.priceOptionId,
  );
  const priceUmrah = priceEntry?.priceUmrah;

  if (!client) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 gap-4">
        <Ionicons name="alert-circle-outline" size={48} color="#cbd5e1" />
        <Text className="text-slate-400">Dossier introuvable.</Text>
        <Button label="Retour" onPress={() => router.back()} variant="ghost" />
      </View>
    );
  }

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 600));
    updateStatus(client.id, "confirmed");
    setConfirming(false);
    Alert.alert("✅ Confirmé", "Le dossier a été confirmé.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleCancel = (reason: string) => {
    setCancelModal(false);
    updateStatus(client.id, "cancelled", reason);
    Alert.alert("Dossier annulé", "Le dossier a été annulé.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const finalPrice =
    (client.selectedPrice ?? 0) - (client.deductionAmount ?? 0);

  // Document helpers
  const docSection = () => {
    if (!client.document)
      return (
        <Text className="text-slate-400 text-sm py-2">
          Aucun document enregistré.
        </Text>
      );
    if (client.document.type === "passport") {
      return (
        <>
          <InfoRow
            icon="document-text-outline"
            label="Type"
            value="Passeport"
          />
          <InfoRow
            icon="card-outline"
            label="Numéro"
            value={client.document.number}
          />
          <InfoRow
            icon="calendar-outline"
            label="Expiration"
            value={client.document.expiryDate}
          />
          <InfoRow
            icon="flag-outline"
            label="Nationalité"
            value={client.document.nationality}
          />
          {client.document.scanImageUri && (
            <Image
              source={{ uri: client.document.scanImageUri }}
              style={{
                width: "100%",
                height: 140,
                borderRadius: 16,
                marginTop: 8,
              }}
              resizeMode="cover"
            />
          )}
        </>
      );
    }
    return (
      <>
        <InfoRow icon="card-outline" label="Type" value="CIN" />
        <InfoRow
          icon="card-outline"
          label="Numéro CIN"
          value={client.document.cinNumber}
        />
        {client.document.cinImageUri && (
          <Image
            source={{ uri: client.document.cinImageUri }}
            style={{
              width: "100%",
              height: 120,
              borderRadius: 16,
              marginTop: 8,
            }}
            resizeMode="cover"
          />
        )}
      </>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <AppHeader title="Détail du dossier" showBack />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-40"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <LinearGradient
          colors={["#0c2340", "#1e3a5f"]}
          className="px-5 pt-5 pb-8"
        >
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 items-center justify-center">
              <Text className="text-white font-bold text-2xl">
                {client.firstName.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-xl">
                {client.firstName} {client.lastName}
              </Text>
              <Text className="text-slate-400 text-sm mt-0.5">
                {client.phone}
              </Text>
              {client.email ? (
                <Text className="text-slate-400 text-xs mt-0.5">
                  {client.email}
                </Text>
              ) : null}
            </View>
            <Badge status={client.status} />
          </View>

          <View className="mt-4 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 flex-row items-center gap-2">
            <Ionicons name="person-circle-outline" size={18} color="#F5A623" />
            <Text className="text-slate-300 text-sm">
              Apporté par{" "}
              <Text className="text-primary-400 font-semibold">
                {client.rabatteurName}
              </Text>
            </Text>
          </View>

          <View className="flex-row gap-3 mt-3">
            <View className="flex-1 bg-white/5 rounded-2xl px-3 py-2">
              <Text className="text-slate-500 text-xs">Créé le</Text>
              <Text className="text-white text-xs font-medium mt-0.5">
                {format(client.createdAt, "dd/MM/yyyy HH:mm")}
              </Text>
            </View>
            {client.confirmedAt && (
              <View className="flex-1 bg-green-500/10 rounded-2xl px-3 py-2">
                <Text className="text-green-400 text-xs">Confirmé le</Text>
                <Text className="text-white text-xs font-medium mt-0.5">
                  {format(client.confirmedAt, "dd/MM/yyyy HH:mm")}
                </Text>
              </View>
            )}
            {client.cancelledAt && (
              <View className="flex-1 bg-red-500/10 rounded-2xl px-3 py-2">
                <Text className="text-red-400 text-xs">Annulé le</Text>
                <Text className="text-white text-xs font-medium mt-0.5">
                  {format(client.cancelledAt, "dd/MM/yyyy HH:mm")}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        <View className="px-4 pt-5 gap-4">
          {/* Cancellation reason */}
          {client.status === "cancelled" && client.cancellationReason && (
            <View className="bg-red-50 border border-red-200 rounded-3xl px-4 py-3 flex-row gap-3">
              <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
              <View className="flex-1">
                <Text className="text-red-600 font-semibold text-sm">
                  Motif d'annulation
                </Text>
                <Text className="text-red-500 text-sm mt-0.5">
                  {client.cancellationReason}
                </Text>
              </View>
            </View>
          )}

          {/* No package notice */}
          {!client.hasPackage && (
            <View className="bg-amber-50 border border-amber-200 rounded-3xl px-4 py-3 flex-row gap-3">
              <Ionicons name="time-outline" size={20} color="#d97706" />
              <Text className="text-amber-700 text-sm flex-1">
                Forfait non encore assigné.
              </Text>
            </View>
          )}

          {/* Personal info */}
          <DetailSection
            title="Informations personnelles"
            icon="person"
            color="bg-ocean-500"
          >
            <InfoRow
              icon="person-outline"
              label="Nom complet"
              value={`${client.firstName} ${client.lastName}`}
            />
            <InfoRow
              icon="call-outline"
              label="Téléphone"
              value={client.phone}
            />
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={client.email ?? "—"}
            />
          </DetailSection>

          {/* Document */}
          <DetailSection
            title="Document d'identité"
            icon="document-text"
            color="bg-purple-500"
          >
            {docSection()}
          </DetailSection>

          {/* Flight */}
          {forecast && (
            <DetailSection title="Vol" icon="airplane" color="bg-sky-500">
              <View className="flex-row items-center gap-3 py-2.5 border-b border-slate-50">
                <View className="w-7 h-7 rounded-lg bg-slate-50 items-center justify-center">
                  <Image
                    source={{ uri: forecast.disponibility.airline.logo }}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-xs">Compagnie</Text>
                  <Text className="text-slate-700 font-medium text-sm mt-0.5">
                    {forecast.disponibility.airline.name}
                  </Text>
                </View>
              </View>
              <InfoRow
                icon="calendar-outline"
                label="Date de départ"
                value={formatDate(forecast.disponibility.date)}
              />
              <InfoRow
                icon="people-outline"
                label="Places disponibles"
                value={`${forecast.disponibility.onStock}`}
              />
            </DetailSection>
          )}

          {/* Room & Hotels */}
          {priceUmrah && (
            <DetailSection
              title="Hébergement & Chambre"
              icon="bed-outline"
              color="bg-primary-500"
            >
              <View className="py-2.5 border-b border-slate-50 flex-row items-center gap-3">
                <View className="w-7 h-7 rounded-lg bg-slate-50 items-center justify-center">
                  <Ionicons name="pricetag-outline" size={14} color="#64748b" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-400 text-xs">
                    Type de chambre
                  </Text>
                  <View className="mt-1">
                    <RoomBadge
                      label={priceUmrah.arrangementMakkahDesignation}
                    />
                  </View>
                </View>
              </View>
              <InfoRow
                icon="business-outline"
                label="Hôtel La Mecque"
                value={priceUmrah.hotelMakkahName}
              />
              <InfoRow
                icon="business-outline"
                label="Hôtel Médine"
                value={priceUmrah.hotelMadinahName}
              />
              <View className="flex-row gap-3 pt-2.5">
                {[
                  {
                    label: client.sansVisa ? "Sans Visa" : "Avec Visa",
                    active: !client.sansVisa,
                  },
                  {
                    label: client.sansBillet ? "Sans Billet" : "Avec Billet",
                    active: !client.sansBillet,
                  },
                ].map(({ label, active }) => (
                  <View
                    key={label}
                    className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl border ${active ? "bg-slate-50 border-slate-200" : "bg-orange-50 border-orange-200"}`}
                  >
                    <Ionicons
                      name={active ? "checkmark-circle" : "close-circle"}
                      size={14}
                      color={active ? "#22c55e" : "#f97316"}
                    />
                    <Text
                      className={`text-xs font-medium ${active ? "text-slate-500" : "text-orange-600"}`}
                    >
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            </DetailSection>
          )}

          {/* Agency */}
          {agency && (
            <DetailSection
              title="Agence assignée"
              icon="storefront"
              color="bg-teal-500"
            >
              <InfoRow
                icon="business-outline"
                label="Agence"
                value={agency.name}
              />
              <InfoRow
                icon="location-outline"
                label="Ville"
                value={agency.city}
              />
              <InfoRow
                icon="person-outline"
                label="Responsable"
                value={agency.managerName}
              />
              <InfoRow
                icon="call-outline"
                label="Téléphone"
                value={agency.phone}
              />
            </DetailSection>
          )}

          {/* Financial */}
          {client.hasPackage && (
            <Card className="gap-0">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="w-8 h-8 rounded-xl bg-emerald-500 items-center justify-center">
                  <Ionicons name="cash-outline" size={16} color="#fff" />
                </View>
                <Text className="text-slate-700 font-bold">
                  Récapitulatif financier
                </Text>
              </View>
              <View className="flex-row justify-between py-2 border-b border-slate-50">
                <Text className="text-slate-400 text-sm">Prix sélectionné</Text>
                <Text className="text-slate-700 text-sm font-medium">
                  {client.selectedPrice?.toLocaleString() ?? "—"} TND
                </Text>
              </View>
              {client.commission != null && (
                <View className="flex-row justify-between py-2 border-b border-slate-50">
                  <Text className="text-slate-400 text-sm">
                    Commission rabatteur
                  </Text>
                  <Text className="text-teal-600 text-sm font-medium">
                    {client.commission.toLocaleString()} TND
                  </Text>
                </View>
              )}
              {client.deductionAmount != null && client.deductionAmount > 0 && (
                <View className="flex-row justify-between py-2 border-b border-slate-50">
                  <Text className="text-slate-400 text-sm">
                    Réduction coupon
                  </Text>
                  <Text className="text-green-600 text-sm font-medium">
                    -{client.deductionAmount.toLocaleString()} TND
                  </Text>
                </View>
              )}
              <LinearGradient
                colors={["#0c2340", "#1e3a5f"]}
                className="rounded-2xl px-4 py-3 mt-3 flex-row justify-between items-center"
              >
                <Text className="text-slate-300 font-medium">Total</Text>
                <Text className="text-primary-400 font-bold text-xl">
                  {finalPrice.toLocaleString()} TND
                </Text>
              </LinearGradient>
            </Card>
          )}

          {client.notes && (
            <Card>
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="chatbox-outline" size={16} color="#64748b" />
                <Text className="text-slate-600 font-semibold">Notes</Text>
              </View>
              <Text className="text-slate-500 text-sm leading-5">
                {client.notes}
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Action buttons */}
      {client.status === "pending" && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pb-8 pt-4 gap-3">
          <Text className="text-slate-400 text-xs text-center mb-1">
            Ce dossier est en attente de votre décision
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setCancelModal(true)}
              className="flex-1 border-2 border-red-200 bg-red-50 rounded-2xl py-4 flex-row items-center justify-center gap-2"
            >
              <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
              <Text className="text-red-500 font-semibold">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={confirming}
              className="flex-1 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={["#22c55e", "#16a34a"]}
                className="py-4 flex-row items-center justify-center gap-2"
              >
                {confirming ? (
                  <Text className="text-white font-semibold">…</Text>
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#fff"
                    />
                    <Text className="text-white font-semibold">Confirmer</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <CancelModal
        visible={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={handleCancel}
      />
    </View>
  );
}
