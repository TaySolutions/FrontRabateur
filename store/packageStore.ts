// store/packageStore.ts
// PackageAllocation: agence selects a forecast, opens it to rabatteurs, sets seat quotas.
import type { PackageAllocation } from "@/types";
import { create } from "zustand";

// Seed: ag1 has opened forecast 8583 to r1 (Ahmed) with 20 seats
const INITIAL_ALLOCATIONS: PackageAllocation[] = [
  {
    id: "pa1",
    forecastId: 8583,
    agencyId: "ag1",
    isOpen: true,
    allocations: [
      {
        rabatteurId: "u2",
        rabatteurName: "Ahmed Ben Ali",
        seatsAllocated: 20,
        seatsUsed: 2,
      },
      {
        rabatteurId: "u3",
        rabatteurName: "Sana Trabelsi",
        seatsAllocated: 10,
        seatsUsed: 0,
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "pa2",
    forecastId: 8632,
    agencyId: "ag1",
    isOpen: true,
    allocations: [
      {
        rabatteurId: "u2",
        rabatteurName: "Ahmed Ben Ali",
        seatsAllocated: 15,
        seatsUsed: 1,
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

interface PackageState {
  allocations: PackageAllocation[];

  // Agence actions
  createAllocation: (forecastId: number, agencyId: string) => void;
  toggleOpen: (id: string) => void;
  setRabatteurSeats: (
    id: string,
    rabatteurId: string,
    rabatteurName: string,
    seats: number,
  ) => void;
  removeRabatteur: (id: string, rabatteurId: string) => void;
  incrementUsed: (
    forecastId: number,
    agencyId: string,
    rabatteurId: string,
  ) => void;

  // Queries
  getForAgency: (agencyId: string) => PackageAllocation[];
  getOpenForRabatteur: (
    rabatteurId: string,
    agencyId?: string,
  ) => PackageAllocation[];
  getAllocationForForecastAgency: (
    forecastId: number,
    agencyId: string,
  ) => PackageAllocation | undefined;
  getRemainingSeats: (
    forecastId: number,
    agencyId: string,
    rabatteurId: string,
  ) => number;
}

export const usePackageStore = create<PackageState>((set, get) => ({
  allocations: INITIAL_ALLOCATIONS,

  createAllocation: (forecastId, agencyId) => {
    const exists = get().allocations.find(
      (a) => a.forecastId === forecastId && a.agencyId === agencyId,
    );
    if (exists) return;
    set((s) => ({
      allocations: [
        {
          id: `pa${Date.now()}`,
          forecastId,
          agencyId,
          isOpen: true,
          allocations: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...s.allocations,
      ],
    }));
  },

  toggleOpen: (id) => {
    set((s) => ({
      allocations: s.allocations.map((a) =>
        a.id === id ? { ...a, isOpen: !a.isOpen, updatedAt: new Date() } : a,
      ),
    }));
  },

  setRabatteurSeats: (id, rabatteurId, rabatteurName, seats) => {
    set((s) => ({
      allocations: s.allocations.map((a) => {
        if (a.id !== id) return a;
        const existing = a.allocations.find(
          (r) => r.rabatteurId === rabatteurId,
        );
        const updated = existing
          ? a.allocations.map((r) =>
              r.rabatteurId === rabatteurId
                ? { ...r, seatsAllocated: seats }
                : r,
            )
          : [
              ...a.allocations,
              {
                rabatteurId,
                rabatteurName,
                seatsAllocated: seats,
                seatsUsed: 0,
              },
            ];
        return { ...a, allocations: updated, updatedAt: new Date() };
      }),
    }));
  },

  removeRabatteur: (id, rabatteurId) => {
    set((s) => ({
      allocations: s.allocations.map((a) =>
        a.id !== id
          ? a
          : {
              ...a,
              allocations: a.allocations.filter(
                (r) => r.rabatteurId !== rabatteurId,
              ),
              updatedAt: new Date(),
            },
      ),
    }));
  },

  incrementUsed: (forecastId, agencyId, rabatteurId) => {
    set((s) => ({
      allocations: s.allocations.map((a) => {
        if (a.forecastId !== forecastId || a.agencyId !== agencyId) return a;
        return {
          ...a,
          allocations: a.allocations.map((r) =>
            r.rabatteurId === rabatteurId
              ? { ...r, seatsUsed: r.seatsUsed + 1 }
              : r,
          ),
          updatedAt: new Date(),
        };
      }),
    }));
  },

  getForAgency: (agencyId) =>
    get().allocations.filter((a) => a.agencyId === agencyId),

  getOpenForRabatteur: (rabatteurId, agencyId) =>
    get().allocations.filter((a) => {
      if (!a.isOpen) return false;
      if (agencyId && a.agencyId !== agencyId) return false;
      return a.allocations.some(
        (r) => r.rabatteurId === rabatteurId && r.seatsAllocated > r.seatsUsed,
      );
    }),

  getAllocationForForecastAgency: (forecastId, agencyId) =>
    get().allocations.find(
      (a) => a.forecastId === forecastId && a.agencyId === agencyId,
    ),

  getRemainingSeats: (forecastId, agencyId, rabatteurId) => {
    const alloc = get().allocations.find(
      (a) => a.forecastId === forecastId && a.agencyId === agencyId,
    );
    if (!alloc) return 0;
    const r = alloc.allocations.find((r) => r.rabatteurId === rabatteurId);
    return r ? Math.max(0, r.seatsAllocated - r.seatsUsed) : 0;
  },
}));
