import { Button } from "@/components/common";
import { FormField } from "@/components/forms";
import { AppHeader } from "@/components/layout";
import { MOCK_AGENCIES } from "@/data/mockData";
import { useAuthStore, useRabatteurStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function RabatteurFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuthStore();
  const { rabatteurs, addRabatteur, updateRabatteur, getById } =
    useRabatteurStore();
  const isEdit = !!id;
  const existing = id ? getById(id) : null;

  // ── Form state ─────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState(existing?.firstName ?? "");
  const [lastName, setLastName] = useState(existing?.lastName ?? "");
  const [email, setEmail] = useState(existing?.email ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [city, setCity] = useState(existing?.city ?? "");
  const [passportNumber, setPassportNumber] = useState(
    existing?.passportNumber ?? "",
  );
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [selectedAgencies, setSelectedAgencies] = useState<string[]>(
    existing?.agencyIds ?? [],
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existing) {
      setFirstName(existing.firstName);
      setLastName(existing.lastName);
      setEmail(existing.email);
      setPhone(existing.phone);
      setCity(existing.city);
      setPassportNumber(existing.passportNumber);
      setSelectedAgencies(existing.agencyIds);
    }
  }, [id]);

  const toggleAgency = (agencyId: string) => {
    setSelectedAgencies((prev) =>
      prev.includes(agencyId)
        ? prev.filter((a) => a !== agencyId)
        : [...prev, agencyId],
    );
  };

  const validate = (): string | null => {
    if (!firstName.trim()) return "Le prénom est requis.";
    if (!lastName.trim()) return "Le nom est requis.";
    if (!email.trim()) return "L'email est requis.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email invalide.";
    if (!phone.trim()) return "Le téléphone est requis.";
    if (!city.trim()) return "La ville est requise.";
    if (!passportNumber.trim()) return "Le numéro de passeport est requis.";
    if (!isEdit) {
      if (!password.trim()) return "Le mot de passe est requis.";
      if (password.length < 8)
        return "Le mot de passe doit contenir au moins 8 caractères.";
      if (password !== confirmPass)
        return "Les mots de passe ne correspondent pas.";
    } else if (password && password !== confirmPass) {
      return "Les mots de passe ne correspondent pas.";
    }
    if (selectedAgencies.length === 0) return "Assignez au moins une agence.";
    // Check email uniqueness
    const emailTaken = rabatteurs.some(
      (r) => r.email.toLowerCase() === email.toLowerCase() && r.id !== id,
    );
    if (emailTaken) return "Cet email est déjà utilisé par un autre rabatteur.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert("Erreur", err);
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    if (isEdit && existing) {
      updateRabatteur(id!, {
        firstName,
        lastName,
        email,
        phone,
        city,
        passportNumber,
        agencyIds: selectedAgencies,
        ...(password ? { password } : {}),
      });
      Alert.alert("✅ Modifié", `${firstName} ${lastName} a été mis à jour.`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      addRabatteur({
        firstName,
        lastName,
        email,
        phone,
        city,
        passportNumber,
        agencyIds: selectedAgencies,
        password,
        active: true,
        createdBy: user?.id ?? "bo1",
      });
      Alert.alert(
        "✅ Créé",
        `${firstName} ${lastName} a été ajouté avec succès.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/backoffice/rabatteurs" as any),
          },
        ],
      );
    }
    setSubmitting(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <AppHeader
        title={isEdit ? "Modifier le rabatteur" : "Nouveau rabatteur"}
        showBack
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pt-5 pb-10 gap-5"
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Identity ─────────────────────────────────────────────────── */}
        <View className="bg-white rounded-3xl p-4 gap-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-8 h-8 rounded-xl bg-purple-100 items-center justify-center">
              <Ionicons name="person-outline" size={16} color="#7c3aed" />
            </View>
            <Text className="text-slate-700 font-bold">
              Informations personnelles
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Prénom *"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Ahmed"
                icon={
                  <Ionicons name="person-outline" size={16} color="#94a3b8" />
                }
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Nom *"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Ben Ali"
                icon={
                  <Ionicons name="person-outline" size={16} color="#94a3b8" />
                }
              />
            </View>
          </View>

          <FormField
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="rabatteur@kounouz.com"
            keyboardType="email-address"
            icon={<Ionicons name="mail-outline" size={16} color="#94a3b8" />}
          />

          <FormField
            label="Téléphone *"
            value={phone}
            onChangeText={setPhone}
            placeholder="+216 55 000 000"
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={16} color="#94a3b8" />}
          />

          <FormField
            label="Ville *"
            value={city}
            onChangeText={setCity}
            placeholder="Tunis"
            icon={
              <Ionicons name="location-outline" size={16} color="#94a3b8" />
            }
          />

          <FormField
            label="Numéro de passeport *"
            value={passportNumber}
            onChangeText={setPassportNumber}
            placeholder="TN 123456"
            icon={
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#94a3b8"
              />
            }
          />
        </View>

        {/* ── Password ─────────────────────────────────────────────────── */}
        <View className="bg-white rounded-3xl p-4 gap-4 shadow-sm">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center">
              <Ionicons name="lock-closed-outline" size={16} color="#64748b" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-700 font-bold">Mot de passe</Text>
              {isEdit && (
                <Text className="text-slate-400 text-xs mt-0.5">
                  Laissez vide pour conserver l'actuel
                </Text>
              )}
            </View>
          </View>

          <FormField
            label={isEdit ? "Nouveau mot de passe" : "Mot de passe *"}
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 8 caractères"
            secureTextEntry
            icon={
              <Ionicons name="lock-closed-outline" size={16} color="#94a3b8" />
            }
          />
          <FormField
            label="Confirmer le mot de passe"
            value={confirmPass}
            onChangeText={setConfirmPass}
            placeholder="Répétez le mot de passe"
            secureTextEntry
            icon={
              <Ionicons name="lock-closed-outline" size={16} color="#94a3b8" />
            }
          />
          {password && confirmPass && password !== confirmPass && (
            <View className="bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5 flex-row items-center gap-2">
              <Ionicons name="alert-circle-outline" size={14} color="#ef4444" />
              <Text className="text-red-500 text-xs">
                Les mots de passe ne correspondent pas
              </Text>
            </View>
          )}
        </View>

        {/* ── Agency assignment ─────────────────────────────────────────── */}
        <View className="bg-white rounded-3xl p-4 gap-3 shadow-sm">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-8 h-8 rounded-xl bg-teal-100 items-center justify-center">
              <Ionicons name="business-outline" size={16} color="#0d9488" />
            </View>
            <View>
              <Text className="text-slate-700 font-bold">
                Agences assignées *
              </Text>
              <Text className="text-slate-400 text-xs mt-0.5">
                Sélectionnez une ou plusieurs agences
              </Text>
            </View>
          </View>

          {MOCK_AGENCIES.map((agency) => {
            const selected = selectedAgencies.includes(agency.id);
            return (
              <TouchableOpacity
                key={agency.id}
                onPress={() => toggleAgency(agency.id)}
                className={`flex-row items-center gap-3 p-3 rounded-2xl border-2 ${
                  selected
                    ? "border-teal-500 bg-teal-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                {/* Checkbox */}
                <View
                  className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${selected ? "bg-teal-500 border-teal-500" : "border-slate-300"}`}
                >
                  {selected && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>

                <View
                  className={`w-9 h-9 rounded-xl items-center justify-center ${selected ? "bg-teal-500" : "bg-white border border-slate-200"}`}
                >
                  <Ionicons
                    name="business-outline"
                    size={17}
                    color={selected ? "#fff" : "#64748b"}
                  />
                </View>

                <View className="flex-1">
                  <Text
                    className={`font-semibold text-sm ${selected ? "text-teal-700" : "text-slate-700"}`}
                  >
                    {agency.name}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <Ionicons
                      name="location-outline"
                      size={11}
                      color={selected ? "#0d9488" : "#94a3b8"}
                    />
                    <Text
                      className={`text-xs ${selected ? "text-teal-600" : "text-slate-400"}`}
                    >
                      {agency.city}
                    </Text>
                  </View>
                </View>

                {selected && (
                  <View className="bg-teal-500 rounded-full w-5 h-5 items-center justify-center">
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {selectedAgencies.length === 0 && (
            <View className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 flex-row items-center gap-2">
              <Ionicons name="warning-outline" size={14} color="#d97706" />
              <Text className="text-amber-600 text-xs">
                Sélectionnez au moins une agence
              </Text>
            </View>
          )}
        </View>

        {/* ── Submit ────────────────────────────────────────────────────── */}
        <Button
          label={
            isEdit ? "Enregistrer les modifications" : "Créer le rabatteur"
          }
          onPress={handleSubmit}
          loading={submitting}
          fullWidth
          size="lg"
          icon={
            <Ionicons
              name={isEdit ? "save-outline" : "person-add-outline"}
              size={18}
              color="#fff"
            />
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
