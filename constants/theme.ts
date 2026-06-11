export const COLORS = {
  primary: "#F5A623",
  primaryDark: "#e89b1a",
  ocean: "#00b0f0",
  oceanDark: "#0087b8",
  navyDark: "#0c2340",
  navyMid: "#1e3a5f",
  success: "#22c55e",
  successDark: "#16a34a",
  danger: "#ef4444",
  dangerDark: "#b91c1c",
  warning: "#f59e0b",
  slate800: "#1e293b",
  slate600: "#475569",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  white: "#ffffff",
} as const;

export const FONTS = {
  regular: "Outfit_400Regular",
  medium: "Outfit_500Medium",
  semibold: "Outfit_600SemiBold",
  bold: "Outfit_700Bold",
  system: "System",
} as const;

/** Room type → badge colors (used by RoomBadge + mockData) */
export const ROOM_BADGE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "Chambre double": { bg: "#22c55e", text: "#fff", border: "#16a34a" },
  "Chambre triple": { bg: "#f59e0b", text: "#fff", border: "#d97706" },
  "Chambre quadruple": { bg: "#ffffff", text: "#374151", border: "#d1d5db" },
};
