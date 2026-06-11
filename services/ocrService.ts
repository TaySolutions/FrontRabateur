import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

const OCR_URL: any = process.env.EXPO_PUBLIC_OCR_URL;

export interface OcrApiResponse {
  firstName?: string;
  lastName?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  birthDate?: string;
  gender?: number;
  nationalityCountryId?: string | number;
  nationality?: string;
}

export interface PassportData {
  firstName: string;
  lastName: string;
  passportNumber: string;
  passportExpiryDate: string;
  birthDate: string;
  gender: "M" | "F" | "";
  nationalityCountryId: string | number | undefined;
  nationalityLabel: string;
}

export async function pickPassportImage(
  source: "camera" | "gallery",
): Promise<{ uri: string; mimeType: string; fileName: string } | null> {
  let result: ImagePicker.ImagePickerResult;

  if (source === "camera") {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission caméra refusée.");
    }
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.92,
      allowsEditing: false,
    });
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission galerie refusée.");
    }
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.92,
      allowsEditing: false,
    });
  }

  if (result.canceled || !result.assets?.[0]) return null;

  const asset = result.assets[0];

  // Resize very large images to avoid slow uploads (max 2000px wide)
  const manipulated = await ImageManipulator.manipulateAsync(
    asset.uri,
    [{ resize: { width: 2000 } }],
    { compress: 0.88, format: ImageManipulator.SaveFormat.JPEG },
  );

  const fileName = `passport_${Date.now()}.jpg`;
  return { uri: manipulated.uri, mimeType: "image/jpeg", fileName };
}

export async function callOcrApi(
  imageUri: string,
  mimeType: string,
  fileName: string,
): Promise<OcrApiResponse> {
  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: fileName || "passport.jpg",
    type: "image/jpeg",
  } as any);

  const response = await fetch(OCR_URL, {
    method: "POST",
    body: formData,
  });

  //console.log("response", response);

  if (!response.ok) {
    throw new Error(`OCR API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function mapOcrResponse(raw: OcrApiResponse): PassportData {
  let gender: "M" | "F" | "" = "";
  if (raw.gender === 0) gender = "M";
  else if (raw.gender !== undefined && raw.gender !== null) gender = "F";

  return {
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    passportNumber: raw.passportNumber ?? "",
    passportExpiryDate: raw.passportExpiryDate ?? "",
    birthDate: raw.birthDate ?? "",
    gender,
    nationalityCountryId: raw.nationalityCountryId,
    nationalityLabel: raw.nationality ?? "",
  };
}

export async function scanAndParsePassport(
  source: "camera" | "gallery",
): Promise<{ data: PassportData; imageUri: string }> {
  const file = await pickPassportImage(source);
  if (!file) throw new Error("CANCELLED");

  const raw = await callOcrApi(file.uri, file.mimeType, file.fileName);
  const data = mapOcrResponse(raw);
  return { data, imageUri: file.uri };
}
