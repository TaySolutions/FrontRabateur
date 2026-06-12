import type { RabatteurProfile } from "@/types";
import { create } from "zustand";

const INITIAL_RABATTEURS: RabatteurProfile[] = [
  {
    id: "u1",
    firstName: "Ahmed",
    lastName: "Ben Ali",
    email: "ahmed@kounouz.com",
    phone: "+216 55 123 456",
    city: "Tunis",
    passportNumber: "TN111111",
    agencyIds: ["ag1", "ag2"],
    password: "rabatteur123",
    active: true,
    createdBy: "bo1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: "u2",
    firstName: "Sana",
    lastName: "Trabelsi",
    email: "sana@kounouz.com",
    phone: "+216 55 987 654",
    city: "Sfax",
    passportNumber: "TN222222",
    agencyIds: ["ag2"],
    password: "rabatteur123",
    active: true,
    createdBy: "bo1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "u3",
    firstName: "Khalil",
    lastName: "Mejri",
    email: "khalil@kounouz.com",
    phone: "+216 55 333 111",
    city: "Sousse",
    passportNumber: "TN333333",
    agencyIds: ["ag3"],
    password: "rabatteur123",
    active: false,
    createdBy: "bo1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
  },
];

// ─── State ────────────────────────────────────────────────────────────────────

interface RabatteurState {
  rabatteurs: RabatteurProfile[];

  // CRUD
  addRabatteur: (
    data: Omit<RabatteurProfile, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateRabatteur: (
    id: string,
    data: Partial<Omit<RabatteurProfile, "id" | "createdAt" | "updatedBy">>,
  ) => void;
  deleteRabatteur: (id: string) => void;
  toggleActive: (id: string) => void;

  // Queries
  getById: (id: string) => RabatteurProfile | undefined;
  getByAgency: (agencyId: string) => RabatteurProfile[];
}

export const useRabatteurStore = create<RabatteurState>((set, get) => ({
  rabatteurs: INITIAL_RABATTEURS,

  addRabatteur: (data) => {
    const r: RabatteurProfile = {
      ...data,
      id: `r${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((s) => ({ rabatteurs: [r, ...s.rabatteurs] }));
  },

  updateRabatteur: (id, data) => {
    set((s) => ({
      rabatteurs: s.rabatteurs.map((r) =>
        r.id === id ? { ...r, ...data, updatedAt: new Date() } : r,
      ),
    }));
  },

  deleteRabatteur: (id) => {
    set((s) => ({ rabatteurs: s.rabatteurs.filter((r) => r.id !== id) }));
  },

  toggleActive: (id) => {
    set((s) => ({
      rabatteurs: s.rabatteurs.map((r) =>
        r.id === id ? { ...r, active: !r.active, updatedAt: new Date() } : r,
      ),
    }));
  },

  getById: (id) => get().rabatteurs.find((r) => r.id === id),
  getByAgency: (agencyId) =>
    get().rabatteurs.filter((r) => r.agencyIds.includes(agencyId)),
}));
