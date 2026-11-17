"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FLAVOURS } from "@/data/flavours";
import { BOXES, DELIVERY_FEE, SLOTS, type BoxSize } from "@/data/config";

export type Status = "new" | "baking" | "ready" | "done";
export type Order = {
  id: string;
  code: string; // LC-F488
  num: number; // #325
  name: string;
  contact: string;
  note?: string;
  mode: "pickup" | "delivery";
  day: string; // YYYY-MM-DD
  dayLabel: string;
  slot: string;
  size: BoxSize;
  items: string[];
  total: number;
  status: Status;
  createdAt: number;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);
const code = () => "LC-" + Math.random().toString(16).slice(2, 6).toUpperCase();
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function makeOrder(p: Omit<Order, "id" | "code" | "num" | "status" | "createdAt" | "total"> & { num: number; status?: Status; createdAt?: number }): Order {
  const total = BOXES[p.size].price + (p.mode === "delivery" ? DELIVERY_FEE : 0);
  return { ...p, id: crypto.randomUUID?.() ?? String(Math.random()), code: code(), total, status: p.status ?? "new", createdAt: p.createdAt ?? Date.now() };
}

function randomBox(size: BoxSize) {
  const fav = [pick(FLAVOURS).id, pick(FLAVOURS).id, pick(FLAVOURS).id];
  return Array.from({ length: size }, () => (Math.random() < 0.6 ? pick(fav) : pick(FLAVOURS).id));
}

const NAMES = ["Sofi", "Martina", "Juli", "Cami", "Lucas", "Agus", "Mica", "Flor", "Tomi", "Belu", "Rocío", "Nico"];
const NOTES = ["Es para un cumple, ¿pueden poner una tarjetita? 🎂", "Una es para regalo", "Tocar timbre 2B", "Sin apuro, retiro a la tarde", ""];

function seed(): Order[] {
  const today = iso(new Date());
  const t = Date.now();
  const base = [
    { name: "Ruby", contact: "@ruby.e", size: 6 as BoxSize, mode: "pickup" as const, slot: SLOTS[0], note: "Es una caja de cumple 🎂", status: "new" as Status, items: ["red-velvet", "red-velvet", "clasica", "choco-rosa", "frambuesa", "oreo"] },
    { name: "Martina", contact: "2494 55-1234", size: 12 as BoxSize, mode: "delivery" as const, slot: SLOTS[1], note: "", status: "new" as Status, items: ["clasica", "clasica", "clasica", "dulce-de-leche", "dulce-de-leche", "oreo", "oreo", "marshmallow", "marshmallow", "red-velvet", "frambuesa", "choco-rosa"] },
    { name: "Lucas", contact: "@lucas.mdp", size: 4 as BoxSize, mode: "pickup" as const, slot: SLOTS[1], note: "", status: "baking" as Status, items: ["oreo", "oreo", "dulce-de-leche", "clasica"] },
    { name: "Cami", contact: "@camiii", size: 6 as BoxSize, mode: "delivery" as const, slot: SLOTS[2], note: "Una es para regalo 💝", status: "baking" as Status, items: ["frambuesa", "frambuesa", "red-velvet", "marshmallow", "clasica", "choco-rosa"] },
    { name: "Agus", contact: "2494 61-9876", size: 6 as BoxSize, mode: "pickup" as const, slot: SLOTS[0], note: "", status: "ready" as Status, items: ["clasica", "clasica", "dulce-de-leche", "dulce-de-leche", "oreo", "marshmallow"] },
  ];
  return base.map((b, i) => makeOrder({ ...b, day: today, dayLabel: "Hoy", num: 321 + i, createdAt: t - (60 - i * 9) * 60000 }));
}

type OrdersState = {
  orders: Order[];
  seeded: boolean;
  ensureSeed: () => void;
  add: (o: Order) => void;
  advance: (id: string) => void;
  simulate: () => Order;
  reset: () => void;
  nextNum: () => number;
};

const NEXT: Record<Status, Status> = { new: "baking", baking: "ready", ready: "done", done: "done" };

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      seeded: false,
      ensureSeed: () => {
        if (!get().seeded) set({ orders: seed(), seeded: true });
      },
      nextNum: () => Math.max(320, ...get().orders.map((o) => o.num)) + 1,
      add: (o) => set((s) => ({ orders: [o, ...s.orders], seeded: true })),
      advance: (id) => set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: NEXT[o.status] } : o)) })),
      simulate: () => {
        const size = pick([4, 6, 6, 6, 12]) as BoxSize;
        const o = makeOrder({
          name: pick(NAMES), contact: "@" + pick(NAMES).toLowerCase() + "." + Math.floor(Math.random() * 90 + 10),
          size, items: randomBox(size), mode: Math.random() < 0.6 ? "pickup" : "delivery",
          day: iso(new Date()), dayLabel: "Hoy", slot: pick(SLOTS), note: pick(NOTES), num: get().nextNum(),
        });
        get().add(o);
        return o;
      },
      reset: () => set({ orders: seed(), seeded: true }),
    }),
    { name: "lcc-orders", storage: createJSONStorage(() => localStorage), skipHydration: true }
  )
);
