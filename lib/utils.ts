/** Format an ISO date string → "27 Mar 2026" */
export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Format an ISO date string → Arabic locale */
export function formatDateAr(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString("ar-TN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Return initials from a full name, e.g. "Ahmed Ben Ali" → "AB" */
export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}
