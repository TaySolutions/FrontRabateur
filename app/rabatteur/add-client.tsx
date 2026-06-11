import { Dots, ScanModal } from "@/components/client";
import { BigField } from "@/components/forms";
import { AppHeader } from "@/components/layout";
import { scanAndParsePassport, type PassportData } from "@/services/ocrService";
import { useAuthStore, useClientsStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddClientScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addClient } = useClientsStore();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 0 — Scan
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrImageUri, setOcrImageUri] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<PassportData | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [hasPassport, setHasPassport] = useState<boolean | null>(null);
  // CIN
  const [cinNumber, setCinNumber] = useState("");
  const [cinImageUri, setCinImageUri] = useState<string | null>(null);

  // Step 1 — Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [passportNat, setPassportNat] = useState("Tunisienne");

  const handleScan = async (source: "camera" | "gallery") => {
    setShowScanModal(false);
    setOcrLoading(true);
    try {
      const { data, imageUri } = await scanAndParsePassport(source);
      setOcrData(data);
      setOcrImageUri(imageUri);
      if (data.firstName) setFirstName(data.firstName);
      if (data.lastName) setLastName(data.lastName);
      if (data.passportNumber) setPassportNumber(data.passportNumber);
      if (data.passportExpiryDate) setPassportExpiry(data.passportExpiryDate);
      if (data.nationalityLabel) setPassportNat(data.nationalityLabel);
      Alert.alert(
        "✅ Passeport scanné",
        "Vérifiez et corrigez si nécessaire.",
        [{ text: "OK" }],
      );
    } catch (err: any) {
      if (err?.message !== "CANCELLED")
        Alert.alert("Erreur", "Saisissez manuellement.", [{ text: "OK" }]);
    } finally {
      setOcrLoading(false);
    }
  };

  const handlePickCin = async (src: "camera" | "gallery") => {
    const fn =
      src === "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    const perm =
      src === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Permission refusée");
      return;
    }
    const r = await fn({ quality: 0.85 });
    if (!r.canceled && r.assets[0]) setCinImageUri(r.assets[0].uri);
  };

  const next = () => {
    if (step === 0) {
      if (hasPassport === null) {
        Alert.alert("", "Indiquez si le pèlerin a un passeport.");
        return;
      }
      if (hasPassport === false && !cinNumber.trim()) {
        Alert.alert("", "Entrez le numéro de la CIN.");
        return;
      }
    }
    if (step === 1) {
      if (!firstName.trim()) {
        Alert.alert("", "Le prénom est obligatoire.");
        return;
      }
      if (!lastName.trim()) {
        Alert.alert("", "Le nom est obligatoire.");
        return;
      }
      if (!phone.trim()) {
        Alert.alert("", "Le téléphone est obligatoire.");
        return;
      }
      if (hasPassport && !passportNumber.trim()) {
        Alert.alert("", "Entrez le numéro de passeport.");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const document = hasPassport
      ? {
          type: "passport" as const,
          number: passportNumber,
          expiryDate: passportExpiry,
          nationality: passportNat,
          scanImageUri: ocrImageUri ?? undefined,
        }
      : {
          type: "cin" as const,
          cinNumber,
          cinImageUri: cinImageUri ?? undefined,
        };

    addClient({
      firstName,
      lastName,
      phone,
      email: email || undefined,
      document,
      hasPackage: false,
      rabatteurId: user?.id ?? "",
      rabatteurName: user?.name ?? "",
      status: "pending",
    });
    setSubmitting(false);
    Alert.alert(
      "✅ Pèlerin enregistré !",
      `${firstName} ${lastName} a été ajouté.\nVous pouvez lui assigner un forfait depuis son dossier.`,
      [{ text: "OK", onPress: () => router.replace("/rabatteur/dashboard") }],
    );
  };

  const STEP_LABELS = ["Document", "Informations", "Vérification"];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <AppHeader title="Nouveau pèlerin" showBack />
      <Dots step={step} total={3} />

      {/* Step label */}
      <View className="px-5 pt-4 pb-2 bg-slate-50">
        <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
          Étape {step + 1} / 3
        </Text>
        <Text className="text-slate-800 text-2xl font-bold mt-0.5">
          {STEP_LABELS[step]}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-10 gap-5"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── STEP 0: Document ─────────────────────────────────────────── */}
        {step === 0 && (
          <View className="gap-5">
            <Text className="text-slate-500 text-base text-center px-4">
              Le pèlerin a-t-il son passeport ?
            </Text>

            {/* Choice cards */}
            <View className="gap-3">
              {[
                {
                  val: true,
                  emoji: "🛂",
                  label: "Oui, il a un passeport",
                  sub: "Scanner ou saisir le numéro",
                  color: "#7c3aed",
                },
                {
                  val: false,
                  emoji: "🪪",
                  label: "Non, seulement une CIN",
                  sub: "Passeport en cours ou absent",
                  color: "#0087b8",
                },
              ].map(({ val, emoji, label, sub, color }) => (
                <TouchableOpacity
                  key={String(val)}
                  onPress={() => setHasPassport(val)}
                  activeOpacity={0.8}
                  className="rounded-3xl p-6 border-2"
                  style={
                    hasPassport === val
                      ? { borderColor: color, backgroundColor: color + "12" }
                      : { borderColor: "#e2e8f0", backgroundColor: "#fff" }
                  }
                >
                  <View className="flex-row items-center gap-4">
                    <Text style={{ fontSize: 40 }}>{emoji}</Text>
                    <View className="flex-1">
                      <Text className="text-slate-800 font-bold text-xl">
                        {label}
                      </Text>
                      <Text className="text-slate-400 text-base mt-0.5">
                        {sub}
                      </Text>
                    </View>
                    <View
                      className="w-8 h-8 rounded-full border-2 items-center justify-center"
                      style={
                        hasPassport === val
                          ? { borderColor: color, backgroundColor: color }
                          : { borderColor: "#cbd5e1" }
                      }
                    >
                      {hasPassport === val && (
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Passport scan zone */}
            {hasPassport === true && (
              <View className="gap-4">
                <View className="h-px bg-slate-200" />
                {ocrLoading ? (
                  <View className="bg-purple-50 rounded-3xl p-10 items-center gap-4 border-2 border-purple-200">
                    <ActivityIndicator size="large" color="#7c3aed" />
                    <Text className="text-purple-700 font-bold text-lg">
                      Lecture OCR…
                    </Text>
                  </View>
                ) : ocrImageUri ? (
                  <View className="gap-3">
                    <View className="rounded-3xl overflow-hidden border-2 border-green-400">
                      <Image
                        source={{ uri: ocrImageUri }}
                        style={{ width: "100%", height: 180 }}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.6)"]}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: 16,
                        }}
                      >
                        <Text className="text-white font-bold text-base">
                          ✅ Passeport scanné
                        </Text>
                      </LinearGradient>
                    </View>
                    <TouchableOpacity
                      onPress={() => setShowScanModal(true)}
                      className="flex-row items-center justify-center gap-2 bg-white border-2 border-slate-200 rounded-2xl py-4"
                    >
                      <Ionicons
                        name="refresh-outline"
                        size={20}
                        color="#64748b"
                      />
                      <Text className="text-slate-600 font-semibold text-base">
                        Scanner à nouveau
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => setShowScanModal(true)}
                    className="border-2 border-dashed border-purple-300 rounded-3xl overflow-hidden"
                  >
                    <LinearGradient
                      colors={["#f5f3ff", "#ede9fe"]}
                      className="p-8 items-center gap-4"
                    >
                      <View className="w-20 h-20 rounded-3xl bg-purple-500 items-center justify-center">
                        <Ionicons name="scan-outline" size={40} color="#fff" />
                      </View>
                      <Text className="text-purple-800 font-bold text-xl">
                        Scanner le passeport
                      </Text>
                      <Text className="text-slate-500 text-base text-center">
                        Extraction automatique des données
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* CIN zone */}
            {hasPassport === false && (
              <View className="gap-4">
                <View className="h-px bg-slate-200" />
                <View className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex-row gap-3">
                  <Text style={{ fontSize: 22 }}>ℹ️</Text>
                  <Text className="text-amber-700 text-base flex-1 leading-6">
                    Le forfait sera assigné plus tard depuis la liste des
                    pèlerins.
                  </Text>
                </View>
                <BigField
                  label="Numéro CIN *"
                  value={cinNumber}
                  onChange={setCinNumber}
                  placeholder="12345678"
                  keyboard="numeric"
                />
                <View className="gap-2">
                  <Text className="text-slate-700 font-semibold text-lg ml-1">
                    Photo CIN{" "}
                    <Text className="text-slate-400 text-sm font-normal">
                      (optionnel)
                    </Text>
                  </Text>
                  {cinImageUri ? (
                    <View className="gap-3">
                      <Image
                        source={{ uri: cinImageUri }}
                        style={{ width: "100%", height: 140, borderRadius: 20 }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => handlePickCin("camera")}
                        className="flex-row items-center justify-center gap-2 bg-white border-2 border-slate-200 rounded-2xl py-4"
                      >
                        <Ionicons
                          name="refresh-outline"
                          size={20}
                          color="#64748b"
                        />
                        <Text className="text-slate-600 font-semibold text-base">
                          Reprendre
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={() => handlePickCin("camera")}
                        className="flex-1 items-center gap-2 bg-ocean-50 border-2 border-ocean-200 rounded-3xl py-6"
                      >
                        <Ionicons
                          name="camera-outline"
                          size={30}
                          color="#0087b8"
                        />
                        <Text className="text-ocean-700 font-semibold text-base">
                          Caméra
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handlePickCin("gallery")}
                        className="flex-1 items-center gap-2 bg-slate-50 border-2 border-slate-200 rounded-3xl py-6"
                      >
                        <Ionicons
                          name="images-outline"
                          size={30}
                          color="#64748b"
                        />
                        <Text className="text-slate-600 font-semibold text-base">
                          Galerie
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* ── STEP 1: Info ─────────────────────────────────────────────── */}
        {step === 1 && (
          <View className="gap-5">
            {ocrData && (
              <View className="bg-green-50 border border-green-200 rounded-3xl p-4 flex-row gap-3">
                <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
                <Text className="text-green-700 text-base flex-1 leading-6">
                  Champs pré-remplis par l'OCR. Vérifiez et corrigez si
                  nécessaire.
                </Text>
              </View>
            )}
            <BigField
              label="Prénom *"
              value={firstName}
              onChange={setFirstName}
              placeholder="Prénom du pèlerin"
            />
            <BigField
              label="Nom *"
              value={lastName}
              onChange={setLastName}
              placeholder="Nom de famille"
            />
            <BigField
              label="Téléphone *"
              value={phone}
              onChange={setPhone}
              placeholder="+216 55 000 000"
              keyboard="phone-pad"
            />
            <BigField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="email@exemple.com"
              keyboard="email-address"
              optional
            />
            {hasPassport && (
              <View className="gap-5">
                <View className="h-px bg-slate-200" />
                <BigField
                  label="N° Passeport *"
                  value={passportNumber}
                  onChange={setPassportNumber}
                  placeholder="TN 123456"
                />
                <BigField
                  label="Expiration passeport"
                  value={passportExpiry}
                  onChange={setPassportExpiry}
                  placeholder="JJ/MM/AAAA"
                />
                <BigField
                  label="Nationalité"
                  value={passportNat}
                  onChange={setPassportNat}
                  placeholder="Tunisienne"
                />
              </View>
            )}
          </View>
        )}

        {/* ── STEP 2: Résumé ────────────────────────────────────────────── */}
        {step === 2 && (
          <View className="gap-4">
            <View className="items-center py-4">
              <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-3">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={38}
                  color="#16a34a"
                />
              </View>
              <Text className="text-2xl font-bold text-slate-800 text-center">
                Tout est prêt !
              </Text>
              <Text className="text-slate-400 text-base text-center mt-1">
                Vérifiez avant d'enregistrer
              </Text>
            </View>

            {/* Client card */}
            <View className="bg-white rounded-3xl p-5 shadow-sm gap-3">
              <View className="flex-row items-center gap-3 mb-1">
                <Text style={{ fontSize: 22 }}>👤</Text>
                <Text className="text-slate-700 font-bold text-lg">
                  Le pèlerin
                </Text>
              </View>
              {[
                ["Nom complet", `${firstName} ${lastName}`],
                ["Téléphone", phone],
                ...(email ? [["Email", email]] : []),
              ].map(([k, v]) => (
                <View
                  key={k}
                  className="flex-row justify-between py-2 border-b border-slate-50"
                >
                  <Text className="text-slate-400 text-base">{k}</Text>
                  <Text className="text-slate-800 font-semibold text-base">
                    {v}
                  </Text>
                </View>
              ))}
            </View>

            {/* Document card */}
            <View className="bg-white rounded-3xl p-5 shadow-sm gap-3">
              <View className="flex-row items-center gap-3 mb-1">
                <Text style={{ fontSize: 22 }}>
                  {hasPassport ? "🛂" : "🪪"}
                </Text>
                <Text className="text-slate-700 font-bold text-lg">
                  Document
                </Text>
              </View>
              {hasPassport ? (
                <>
                  <View className="flex-row justify-between py-2 border-b border-slate-50">
                    <Text className="text-slate-400 text-base">Type</Text>
                    <Text className="text-slate-800 font-semibold text-base">
                      Passeport
                    </Text>
                  </View>
                  {passportNumber ? (
                    <View className="flex-row justify-between py-2 border-b border-slate-50">
                      <Text className="text-slate-400 text-base">Numéro</Text>
                      <Text className="text-slate-800 font-semibold text-base">
                        {passportNumber}
                      </Text>
                    </View>
                  ) : null}
                  {ocrImageUri && (
                    <Image
                      source={{ uri: ocrImageUri }}
                      style={{
                        width: "100%",
                        height: 130,
                        borderRadius: 16,
                        marginTop: 8,
                      }}
                      resizeMode="cover"
                    />
                  )}
                </>
              ) : (
                <>
                  <View className="flex-row justify-between py-2 border-b border-slate-50">
                    <Text className="text-slate-400 text-base">Type</Text>
                    <Text className="text-slate-800 font-semibold text-base">
                      CIN
                    </Text>
                  </View>
                  <View className="flex-row justify-between py-2 border-b border-slate-50">
                    <Text className="text-slate-400 text-base">Numéro CIN</Text>
                    <Text className="text-slate-800 font-semibold text-base">
                      {cinNumber}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Package notice */}
            <View className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex-row gap-3">
              <Text style={{ fontSize: 22 }}>⏳</Text>
              <View className="flex-1">
                <Text className="text-amber-700 font-bold text-base">
                  Forfait à assigner
                </Text>
                <Text className="text-amber-600 text-sm mt-1 leading-5">
                  Après l'enregistrement, revenez assigner un forfait depuis la
                  liste des pèlerins ou via "Assigner un forfait".
                </Text>
              </View>
            </View>

            <View className="bg-slate-100 rounded-3xl p-4 flex-row gap-3">
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#64748b"
              />
              <Text className="text-slate-500 text-sm flex-1 leading-5">
                Le dossier sera créé avec le statut{" "}
                <Text className="font-bold text-amber-600">EN ATTENTE</Text>.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation */}
      <View className="px-4 pb-8 pt-3 bg-white border-t border-slate-100 gap-3">
        {step < 2 ? (
          <TouchableOpacity
            onPress={next}
            className="rounded-3xl overflow-hidden"
          >
            <LinearGradient
              colors={["#F5A623", "#e89b1a"]}
              className="flex-row items-center justify-center gap-3 py-5"
            >
              <Text className="text-white font-bold text-xl">Continuer</Text>
              <Ionicons name="chevron-forward" size={26} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={submit}
            disabled={submitting}
            className="rounded-3xl overflow-hidden"
          >
            <LinearGradient
              colors={["#22c55e", "#16a34a"]}
              className="flex-row items-center justify-center gap-3 py-5"
            >
              {submitting ? (
                <Text className="text-white font-bold text-xl">
                  Enregistrement…
                </Text>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={26}
                    color="#fff"
                  />
                  <Text className="text-white font-bold text-xl">
                    Enregistrer le pèlerin
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
        {step > 0 && (
          <TouchableOpacity
            onPress={() => setStep((s) => s - 1)}
            className="flex-row items-center justify-center gap-2 py-3"
          >
            <Ionicons name="chevron-back" size={20} color="#94a3b8" />
            <Text className="text-slate-400 font-medium text-base">
              Étape précédente
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScanModal
        visible={showScanModal}
        onClose={() => setShowScanModal(false)}
        onPick={handleScan}
      />
    </KeyboardAvoidingView>
  );
}
