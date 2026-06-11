import { MOCK_AGENCIES, MOCK_FORECASTS } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { scanAndParsePassport, type PassportData } from "@/services/ocrService";
import { useAuthStore, useClientsStore } from "@/store";
import type { UmrahForecast } from "@/types";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Platform } from "react-native";

const STEPS = ["Identité", "Voyage", "Agence", "Résumé"] as const;
export type Step = (typeof STEPS)[number];

export function useClientForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addClient } = useClientsStore();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // ── Step 0 — Identity ───────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [firstNameAr, setFirstNameAr] = useState("");
  const [lastNameAr, setLastNameAr] = useState("");
  const [fatherNameAr, setFatherNameAr] = useState("");

  // Passport
  const [passportNumber, setPassportNumber] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "">("");

  // OCR
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrImageUri, setOcrImageUri] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<PassportData | null>(null);
  const [showSourcePicker, setShowSourcePicker] = useState(false);

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /** True when OCR ran AND the field has a value */
  const isOcr = (val: string) => !!ocrData && val.trim().length > 0;

  const handleScan = async (source: "camera" | "gallery") => {
    setShowSourcePicker(false);
    setOcrLoading(true);
    try {
      const { data, imageUri } = await scanAndParsePassport(source);
      // console.log(data);
      setOcrData(data);
      setOcrImageUri(imageUri);
      if (data.firstName) setFirstName(data.firstName);
      if (data.lastName) setLastName(data.lastName);
      if (data.passportNumber) setPassportNumber(data.passportNumber);
      if (data.passportExpiryDate) setPassportExpiry(data.passportExpiryDate);
      if (data.birthDate) setDateOfBirth(data.birthDate);
      if (data.gender) setGender(data.gender);
      if (data.nationalityLabel) {
        setNationality(data.nationalityLabel);
      } else if (data.nationalityCountryId) {
        setNationality(String(data.nationalityCountryId));
      }
      Alert.alert(
        "✅ Scan réussi",
        "Données extraites. Vérifiez et corrigez si nécessaire.",
        [{ text: "OK" }],
      );
    } catch (err: any) {
      if (err?.message === "CANCELLED") return;
      Alert.alert("Erreur de scan", err?.message ?? "Saisissez manuellement.", [
        { text: "OK" },
      ]);
    } finally {
      setOcrLoading(false);
    }
  };

  // ── Step 1 — Voyage ─────────────────────────────────────────────────────────
  const [selectedForecastId, setSelectedForecastId] = useState<number | null>(
    null,
  );
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [selectedPriceEntry, setSelectedPriceEntry] = useState<
    UmrahForecast["prices"][0] | null
  >(null);
  const [sansVisa, setSansVisa] = useState(false);
  const [sansBillet, setSansBillet] = useState(false);

  const selectedForecast =
    MOCK_FORECASTS.find((f) => f.id === selectedForecastId) ?? null;

  const selectForecast = (forecast: UmrahForecast) => {
    if (selectedForecastId === forecast.id) return;
    setSelectedForecastId(forecast.id);
    setSelectedPriceId(null);
    setSelectedPriceEntry(null);
  };

  const selectPrice = (entry: UmrahForecast["prices"][0]) => {
    setSelectedPriceId(entry.priceUmrah.id);
    setSelectedPriceEntry(entry);
  };

  const clearForecast = () => {
    setSelectedForecastId(null);
    setSelectedPriceId(null);
    setSelectedPriceEntry(null);
  };

  // ── Step 2 — Agency ─────────────────────────────────────────────────────────
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [notes, setNotes] = useState("");

  const selectedAgency = MOCK_AGENCIES.find((a) => a.id === selectedAgencyId);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (step === 0) {
      if (!firstName.trim() || !lastName.trim() || !phone.trim())
        return "Veuillez remplir Prénom, Nom et Téléphone.";
      if (!passportNumber.trim() || !passportExpiry.trim())
        return "Numéro et date d'expiration du passeport requis.";
    }
    if (step === 1) {
      if (!selectedForecastId) return "Veuillez choisir un vol.";
      if (!selectedPriceId) return "Veuillez choisir un type de chambre.";
    }
    if (step === 2 && !selectedAgencyId) return "Veuillez choisir une agence.";
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) {
      Alert.alert("Champs manquants", err);
      return;
    }
    setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => s - 1);
  const openLocationSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  };
  const submit = async () => {
    if (!location) {
      Alert.alert(
        "Localisation requise",
        "Veuillez activer la localisation pour continuer.",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Activer",
            onPress: () => openLocationSettings(),
          },
        ],
      );
      return;
    }
    if (!selectedForecast || !selectedPriceEntry) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));

    const p = selectedPriceEntry.priceUmrah;
    const depDate = formatDate(selectedForecast.disponibility.date);

    addClient({
      firstName,
      lastName,
      email,
      phone,
      address,
      firstNameAr,
      lastNameAr,
      fatherNameAr,
      dateOfBirth,
      gender,
      passport: {
        number: passportNumber,
        expiryDate: passportExpiry,
        nationality,
      },
      forecastId: selectedForecast.id,
      priceOptionId: p.id,
      selectedForecastLabel: `${selectedForecast.disponibility.airline.name} — ${depDate}`,
      selectedPriceLabel: `${p.arrangementMakkahDesignation} · ${p.hotelMakkahName}`,
      selectedPrice: p.price,
      agencyId: selectedAgencyId,
      sansVisa,
      sansBillet,
      rabatteurId: user?.id ?? "",
      rabatteurName: user?.name ?? "",
      status: "pending",
      couponCode: couponCode || undefined,
      notes: notes || undefined,
    });

    setSubmitting(false);
    Alert.alert(
      "✅ Client ajouté",
      `${firstName} ${lastName} a été enregistré et est en attente de confirmation.`,
      [{ text: "OK", onPress: () => router.replace("/rabatteur/dashboard") }],
    );
  };

  const finalPrice =
    (selectedPriceEntry?.priceUmrah.price ?? 0) - (couponCode ? 100 : 0);

  return {
    // navigation
    step,
    steps: STEPS,
    next,
    prev,
    submitting,
    // identity
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    address,
    setAddress,
    firstNameAr,
    setFirstNameAr,
    lastNameAr,
    setLastNameAr,
    fatherNameAr,
    setFatherNameAr,
    // passport
    passportNumber,
    setPassportNumber,
    passportExpiry,
    setPassportExpiry,
    dateOfBirth,
    setDateOfBirth,
    nationality,
    setNationality,
    gender,
    setGender,
    // ocr
    ocrLoading,
    ocrImageUri,
    ocrData,
    showSourcePicker,
    setShowSourcePicker,
    handleScan,
    isOcr,
    setLocation,
    setErrorMsg,
    // voyage
    selectedForecastId,
    selectedPriceId,
    selectedPriceEntry,
    selectedForecast,
    sansVisa,
    setSansVisa,
    sansBillet,
    setSansBillet,
    selectForecast,
    selectPrice,
    clearForecast,
    // agency
    selectedAgencyId,
    setSelectedAgencyId,
    couponCode,
    setCouponCode,
    notes,
    setNotes,
    selectedAgency,
    // summary
    finalPrice,
    submit,
  };
}
