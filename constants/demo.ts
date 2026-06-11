export const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  backoffice: "/backoffice/dashboard",
  rabatteur: "/rabatteur/dashboard",
};

export const DEMO_SHORTCUTS = [
  {
    key: "admin" as const,
    label: "Admin",
    icon: "shield-checkmark-outline",
    color: "#F5A623",
  },
  {
    key: "backoffice" as const,
    label: "Backoffice",
    icon: "people-circle-outline",
    color: "#a78bfa",
  },
  {
    key: "rabatteur" as const,
    label: "Rabatteur",
    icon: "person-outline",
    color: "#00b0f0",
  },
];
