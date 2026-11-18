"use client";
import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { useUI } from "@/store/ui";

// Hidrata los stores desde localStorage y escucha el evento `storage`
// para que un pedido hecho en /tienda aparezca al instante en /cocina (otra pestaña).
export default function StoreSync() {
  useEffect(() => {
    Promise.all([useCart.persist.rehydrate(), useOrders.persist.rehydrate()]).then(() => {
      useOrders.getState().ensureSeed();
      useUI.getState().setHydrated();
    });
    const onStorage = (e: StorageEvent) => {
      if (e.key === "lcc-orders-v2") useOrders.persist.rehydrate();
      if (e.key === "lcc-cart-v2") useCart.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
