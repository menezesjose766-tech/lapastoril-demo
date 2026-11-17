"use client";
import { create } from "zustand";

export type Flight = { id: number; flavourId: string; from: { x: number; y: number; w: number }; slot: number };

type UIState = {
  hydrated: boolean;
  setHydrated: () => void;
  // vuelos de cookies hacia la caja
  flights: Flight[];
  pending: number[];
  launch: (f: Omit<Flight, "id">) => void;
  land: (id: number) => void;
  // transición tipo caja
  phase: "idle" | "closing" | "opening";
  target: string | null;
  setPhase: (p: UIState["phase"], target?: string | null) => void;
  // checkout
  checkoutOpen: boolean;
  setCheckout: (o: boolean) => void;
};

let fid = 0;
export const useUI = create<UIState>()((set) => ({
  hydrated: false,
  setHydrated: () => set({ hydrated: true }),
  flights: [],
  pending: [],
  launch: (f) => set((s) => ({ flights: [...s.flights, { ...f, id: ++fid }], pending: [...s.pending, f.slot] })),
  land: (id) =>
    set((s) => {
      const f = s.flights.find((x) => x.id === id);
      return { flights: s.flights.filter((x) => x.id !== id), pending: f ? s.pending.filter((p) => p !== f.slot) : s.pending };
    }),
  phase: "idle",
  target: null,
  setPhase: (phase, target = null) => set({ phase, target }),
  checkoutOpen: false,
  setCheckout: (checkoutOpen) => set({ checkoutOpen }),
}));
