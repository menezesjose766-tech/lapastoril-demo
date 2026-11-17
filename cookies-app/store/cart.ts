"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BOXES, type BoxSize } from "@/data/config";

type CartState = {
  size: BoxSize;
  items: string[]; // un id de sabor por hueco, en orden
  setSize: (s: BoxSize) => void;
  add: (id: string) => number; // devuelve el índice del hueco o -1 si está llena
  removeOne: (id: string) => void;
  removeAt: (i: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      size: 6,
      items: [],
      setSize: (size) => set((s) => ({ size, items: s.items.slice(0, size) })),
      add: (id) => {
        const { items, size } = get();
        if (items.length >= size) return -1;
        set({ items: [...items, id] });
        return items.length;
      },
      removeOne: (id) =>
        set((s) => {
          const i = s.items.lastIndexOf(id);
          if (i < 0) return s;
          const items = [...s.items];
          items.splice(i, 1);
          return { items };
        }),
      removeAt: (i) => set((s) => ({ items: s.items.filter((_, k) => k !== i) })),
      clear: () => set({ items: [] }),
    }),
    { name: "lcc-cart", storage: createJSONStorage(() => localStorage), skipHydration: true }
  )
);

export const boxPrice = (size: BoxSize) => BOXES[size].price;
