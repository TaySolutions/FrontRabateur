import { FormField } from "@/components/forms";
import { SectionHeader } from "@/components/layout";
import type { useClientForm } from "@/hooks/useClientForm";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = ReturnType<typeof useClientForm>;

export function StepIdentity(props: Props) {
  const {
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
    ocrLoading,
    ocrImageUri,
    ocrData,
    setShowSourcePicker,
    isOcr,
  } = props;

  return (
    <View className="gap-4">
      {/* Scan states */}
      <SectionHeader
        title="Scanneur"
        subtitle="Scanner le passeport"
        icon="scan-outline"
        iconBg="bg-ocean-500"
      />
      {ocrLoading ? (
        <View className="bg-ocean-50 border-2 border-ocean-200 rounded-3xl p-8 items-center gap-4">
          <ActivityIndicator size="large" color="#00b0f0" />
          <Text className="text-ocean-700 font-semibold text-base">
            Lecture OCR en cours…
          </Text>
          <Text className="text-slate-400 text-xs text-center">
            Extraction des données du passeport via l'API
          </Text>
        </View>
      ) : ocrImageUri ? (
        <View className="gap-3">
          <View className="rounded-3xl overflow-hidden border-2 border-success">
            <Image
              source={{ uri: ocrImageUri }}
              style={{ width: "100%", height: 160 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: 12,
              }}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#4ade80" />
                <Text className="text-white font-semibold text-sm">
                  Passeport scanné avec succès
                </Text>
              </View>
            </LinearGradient>
          </View>
          <TouchableOpacity
            onPress={() => setShowSourcePicker(true)}
            className="flex-row items-center justify-center gap-2 border border-slate-200 bg-white rounded-2xl py-3"
          >
            <Ionicons name="refresh-outline" size={16} color="#64748b" />
            <Text className="text-slate-500 text-sm font-medium">
              Scanner à nouveau
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowSourcePicker(true)}
          className="border-2 border-dashed border-ocean-300 rounded-3xl overflow-hidden"
        >
          <LinearGradient
            colors={["#e0f7ff", "#f0faff"]}
            className="p-6 items-center gap-3"
          >
            <LinearGradient
              colors={["#00b0f0", "#0087b8"]}
              className="w-14 h-14 rounded-2xl items-center justify-center"
            >
              <Ionicons name="scan-outline" size={26} color="#fff" />
            </LinearGradient>
            <Text className="text-ocean-800 font-bold text-base">
              Scanner le passeport
            </Text>
            <Text className="text-slate-500 text-xs text-center">
              API OCR — remplissage automatique des champs
            </Text>
            <View className="flex-row gap-5">
              {[
                { icon: "camera-outline", label: "Caméra" },
                { icon: "images-outline", label: "Galerie" },
              ].map(({ icon, label }) => (
                <View key={label} className="flex-row items-center gap-1.5">
                  <View className="w-5 h-5 rounded-full bg-ocean-100 items-center justify-center">
                    <Ionicons name={icon as any} size={11} color="#0087b8" />
                  </View>
                  <Text className="text-ocean-600 text-xs font-medium">
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* OCR notice */}
      {ocrData && !ocrLoading && (
        <View className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex-row items-center gap-3">
          <Ionicons name="information-circle" size={16} color="#16a34a" />
          <Text className="text-green-700 text-sm flex-1">
            Champs marqués <Text className="font-bold">OCR</Text> pré-remplis.
            Corrigez si nécessaire.
          </Text>
        </View>
      )}

      <View className="flex-row items-center gap-3">
        <View className="flex-1 h-px bg-slate-200" />
        <Text className="text-slate-400 text-xs">
          {ocrData
            ? "Champs pré-remplis — modifiables"
            : "ou saisir manuellement"}
        </Text>
        <View className="flex-1 h-px bg-slate-200" />
      </View>

      {/* ── Personal Info (Latin) ─────────────────────────────────────── */}
      <SectionHeader
        title="Informations personnelles"
        subtitle="Coordonnées du client"
        icon="person-outline"
        iconBg="bg-ocean-500"
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            label="Prénom *"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Youssef"
            showOcr={isOcr(firstName)}
            icon={
              <Ionicons
                name="person-outline"
                size={16}
                color={isOcr(firstName) ? "#16a34a" : "#94a3b8"}
              />
            }
          />
        </View>
        <View className="flex-1">
          <FormField
            label="Nom *"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Ben Ali"
            showOcr={isOcr(lastName)}
            icon={
              <Ionicons
                name="person-outline"
                size={16}
                color={isOcr(lastName) ? "#16a34a" : "#94a3b8"}
              />
            }
          />
        </View>
      </View>

      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="client@email.com"
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
        label="Adresse"
        value={address}
        onChangeText={setAddress}
        placeholder="Rue, Ville"
        multiline
        numberOfLines={2}
        icon={<Ionicons name="home-outline" size={16} color="#94a3b8" />}
      />

      {/* Divider */}
      <View className="h-px bg-slate-200 my-1" />

      {/* ── Arabic Names ──────────────────────────────────────────────── */}
      <SectionHeader
        title="الأسماء بالعربية"
        subtitle="Noms en arabe"
        icon="language-outline"
        iconBg="bg-primary-500"
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            label="اللقب *"
            value={lastNameAr}
            onChangeText={setLastNameAr}
            placeholder="بن علي"
            rtl
          />
        </View>
        <View className="flex-1">
          <FormField
            label="الاسم *"
            value={firstNameAr}
            onChangeText={setFirstNameAr}
            placeholder="يوسف"
            rtl
          />
        </View>
      </View>

      <FormField
        label="اسم الأب"
        value={fatherNameAr}
        onChangeText={setFatherNameAr}
        placeholder="محمد"
        rtl
        icon={<Ionicons name="people-outline" size={16} color="#94a3b8" />}
      />

      {/* Divider */}
      <View className="h-px bg-slate-200 my-1" />

      {/* ── Passport ──────────────────────────────────────────────────── */}
      <SectionHeader
        title="Passeport"
        subtitle="Scannez ou saisissez manuellement"
        icon="document-text-outline"
        iconBg="bg-purple-500"
      />

      {/* Passport fields */}
      <FormField
        label="Numéro de passeport *"
        value={passportNumber}
        onChangeText={setPassportNumber}
        placeholder="TN 123456"
        showOcr={isOcr(passportNumber)}
        icon={
          <Ionicons
            name="document-text-outline"
            size={16}
            color={isOcr(passportNumber) ? "#16a34a" : "#94a3b8"}
          />
        }
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <FormField
            label="Date d'expiration *"
            value={passportExpiry}
            onChangeText={setPassportExpiry}
            placeholder="JJ/MM/AAAA"
            showOcr={isOcr(passportExpiry)}
            icon={
              <Ionicons
                name="calendar-outline"
                size={16}
                color={isOcr(passportExpiry) ? "#16a34a" : "#94a3b8"}
              />
            }
          />
        </View>
        <View className="flex-1">
          <FormField
            label="Date de naissance"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="JJ/MM/AAAA"
            showOcr={isOcr(dateOfBirth)}
            icon={
              <Ionicons
                name="gift-outline"
                size={16}
                color={isOcr(dateOfBirth) ? "#16a34a" : "#94a3b8"}
              />
            }
          />
        </View>
      </View>

      <FormField
        label="Nationalité"
        value={nationality}
        onChangeText={setNationality}
        placeholder="Tunisienne"
        showOcr={isOcr(nationality)}
        icon={
          <Ionicons
            name="flag-outline"
            size={16}
            color={isOcr(nationality) ? "#16a34a" : "#94a3b8"}
          />
        }
      />

      {/* Gender */}
      <View className="gap-1.5">
        <View className="flex-row items-center gap-2 ml-1">
          <Text className="text-slate-600 font-medium text-sm">Genre</Text>
          {gender && ocrData && (
            <View className="flex-row items-center gap-1 bg-green-100 rounded-full px-2 py-0.5">
              <Ionicons name="scan-outline" size={10} color="#16a34a" />
              <Text className="text-green-600 text-xs font-semibold">OCR</Text>
            </View>
          )}
        </View>
        <View className="flex-row gap-3">
          {(["M", "F"] as const).map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g)}
              className={`flex-1 py-3.5 rounded-2xl border-2 flex-row items-center justify-center gap-2 ${
                gender === g
                  ? "border-ocean-500 bg-blue-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <Ionicons
                name={g === "M" ? "male-outline" : "female-outline"}
                size={18}
                color={gender === g ? "#0087b8" : "#94a3b8"}
              />
              <Text
                className={`font-semibold text-sm ${gender === g ? "text-ocean-600" : "text-slate-400"}`}
              >
                {g === "M" ? "Masculin" : "Féminin"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
