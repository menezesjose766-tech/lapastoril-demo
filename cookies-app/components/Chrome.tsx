"use client";
import { usePath } from "@/lib/route";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import BoxTransition from "@/components/BoxTransition";
import FlyLayer from "@/components/FlyLayer";
import { BRAND } from "@/data/config";

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePath();
  const kitchen = pathname.startsWith("/cocina");
  return (
    <>
      {!kitchen && <Navbar />}
      {children}
      <FlyLayer />
      <BoxTransition />
      <Preloader />
      {BRAND.demo && (
        <div className={`fixed z-[70] bottom-3 md:bottom-4 pointer-events-none right-3 md:right-4 ${pathname.startsWith("/tienda") || kitchen ? "max-lg:hidden" : ""}`} style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-3 py-1.5 text-[11px] font-semibold shadow-lg">
            <span className="num bg-choco text-cream rounded-full px-1.5 py-px text-[10px]">DEMO</span> Propuesta de diseño · no es la tienda oficial
          </span>
        </div>
      )}
    </>
  );
}
