"use client";
import { usePathname } from "next/navigation";
import { create } from "zustand";

/** Modo "una sola página" (para publicar la demo como un único archivo).
 *  En ese modo las rutas son vistas: "/", "/tienda", "/cocina" (en la URL: #tienda, #cocina). */
export const SPA = process.env.NEXT_PUBLIC_SPA === "1";

export const useRoute = create<{ route: string; set: (r: string) => void }>()((set) => ({
  route: "/",
  set: (route) => {
    set({ route });
    if (typeof window !== "undefined") {
      const h = route === "/" ? "" : route.slice(1);
      history.replaceState(null, "", h ? "#" + h : location.pathname + location.search);
    }
  },
}));

export function usePath() {
  const pn = usePathname();
  const r = useRoute((s) => s.route);
  return SPA ? r : pn;
}

export function initSpaRoute() {
  const h = location.hash.slice(1);
  if (h === "tienda" || h === "cocina") useRoute.setState({ route: "/" + h });
}
