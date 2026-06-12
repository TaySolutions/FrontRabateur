// store/clientsStore.ts
import type { Client } from "@/types";
import { create } from "zustand";

const INITIAL_CLIENTS: Client[] = [
  {
    id: "c1",
    firstName: "Youssef",
    lastName: "Ben Salah",
    phone: "+216 55 111 222",
    email: "youssef@example.com",
    document: {
      type: "passport",
      number: "TN123456",
      expiryDate: "2028-06-15",
      nationality: "Tunisienne",
    },
    hasPackage: true,
    forecastId: 8583,
    priceOptionId: 11894,
    selectedForecastLabel: "Tunisair — 27 Mar 2026",
    selectedPriceLabel: "Chambre double · الشهداء+فطور الصباح",
    selectedPrice: 6700,
    sansVisa: false,
    sansBillet: false,
    agencyId: "ag1",
    rabatteurId: "u2",
    rabatteurName: "Ahmed Ben Ali",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "c2",
    firstName: "Mariem",
    lastName: "Khelifi",
    phone: "+216 55 333 444",
    email: "mariem@example.com",
    document: {
      type: "passport",
      number: "TN789012",
      expiryDate: "2027-03-20",
      nationality: "Tunisienne",
    },
    hasPackage: true,
    forecastId: 8632,
    priceOptionId: 11918,
    selectedForecastLabel: "Tunisair — 21 Mar 2026",
    selectedPriceLabel: "Chambre double · الشهداء+فطور",
    selectedPrice: 6950,
    sansVisa: false,
    sansBillet: false,
    agencyId: "ag2",
    rabatteurId: "u2",
    rabatteurName: "Ahmed Ben Ali",
    status: "confirmed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
    confirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
  },
  {
    id: "c3",
    firstName: "Tarek",
    lastName: "Dridi",
    phone: "+216 55 555 666",
    // CIN only — passport en cours
    document: { type: "cin", cinNumber: "11234567" },
    hasPackage: false, // package not yet assigned
    agencyId: "ag3",
    rabatteurId: "u3",
    rabatteurName: "Sana Trabelsi",
    status: "pending",
    notes: "Passeport en cours de renouvellement. Forfait à assigner.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
  },
  {
    id: "c4",
    firstName: "Nadia",
    lastName: "Bouzid",
    phone: "+216 55 777 888",
    document: {
      type: "passport",
      number: "TN901234",
      expiryDate: "2029-08-10",
      nationality: "Tunisienne",
    },
    hasPackage: true,
    forecastId: 8700,
    priceOptionId: 12000,
    selectedForecastLabel: "Nouvelair — 10 Avr 2026",
    selectedPriceLabel: "Chambre double · الشهداء+فطور الصباح",
    selectedPrice: 7200,
    sansVisa: false,
    sansBillet: false,
    agencyId: "ag4",
    rabatteurId: "u2",
    rabatteurName: "Ahmed Ben Ali",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

interface ClientsState {
  clients: Client[];
  addClient: (c: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  updateStatus: (
    id: string,
    status: "confirmed" | "cancelled",
    reason?: string,
  ) => void;
  assignPackage: (
    id: string,
    packageData: Pick<
      Client,
      | "forecastId"
      | "priceOptionId"
      | "selectedForecastLabel"
      | "selectedPriceLabel"
      | "selectedPrice"
      | "sansVisa"
      | "sansBillet"
      | "agencyId"
    >,
  ) => void;
  setClientCommission: (id: string, amount: number) => void;
  getByRabatteur: (rabatteurId: string) => Client[];
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: INITIAL_CLIENTS,

  addClient: (data) => {
    set((s) => ({
      clients: [
        {
          ...data,
          id: `c${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...s.clients,
      ],
    }));
  },

  updateStatus: (id, status, reason) => {
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id !== id
          ? c
          : {
              ...c,
              status,
              updatedAt: new Date(),
              ...(status === "confirmed" ? { confirmedAt: new Date() } : {}),
              ...(status === "cancelled"
                ? { cancelledAt: new Date(), cancellationReason: reason }
                : {}),
            },
      ),
    }));
  },

  assignPackage: (id, packageData) => {
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id !== id
          ? c
          : { ...c, ...packageData, hasPackage: true, updatedAt: new Date() },
      ),
    }));
  },

  setClientCommission: (id, amount) => {
    set((s) => ({
      clients: s.clients.map((c) =>
        c.id !== id ? c : { ...c, commission: amount, updatedAt: new Date() },
      ),
    }));
  },

  getByRabatteur: (rabatteurId) =>
    get().clients.filter((c) => c.rabatteurId === rabatteurId),
}));
