"use client";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { FLAVOURS } from "@/data/flavours";
import { BOXES, money } from "@/data/config";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { Slots } from "./Slots";
import { SizePicker } from "./SizePicker";
import { FlavourCard } from "./FlavourCard";
import Checkout from "./Checkout";
import { Seal } from "@/components/ui/Seal";

export default function Builder() {
  const { size, items, clear } = useCart();
  const hydrated = useUI((s) => s.hydrated);
  const setCheckout = useUI((s) => s.setCheckout);
  const shake = useAnimationControls();
  const [toast, setToast] = useState(false);
  const n = hydrated ? items.length : 0;
  const full = n === size;
  const left = size - n;
  const box = BOXES[size];

  const onFull = () => {
    shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } });
    setToast(true);
    setTimeout(() => setToast(false), 1800);
  };

  const cta = (
    <button disabled={!full} onClick={() => setCheckout(true)} className="group w-full inline-flex items-center justify-between gap-3 rounded-full bg-blush text-choco pl-6 pr-1.5 py-1.5 font-bold text-[16px] disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:shadow-[0_14px_30px_-10px_#F2C6DE] active:enabled:scale-[.98] transition">
      {full ? "Continuar al checkout" : `Te ${left === 1 ? "falta" : "faltan"} ${left}`}
      <span className="w-10 h-10 rounded-full bg-choco text-cream grid place-items-center transition-transform group-enabled:group-hover:-rotate-45"><ArrowRight className="w-4 h-4" /></span>
    </button>
  );

  return (
    <main className="mx-auto max-w-[1440px] px-4 md:px-8 pt-20 md:pt-24 pb-36 lg:pb-16 lg:grid lg:grid-cols-[35%_1fr] lg:gap-8">
      {/* Caja visual (desktop) */}
      <aside className="hidden lg:block">
        <motion.div animate={shake} className="sticky top-24 rounded-3xl bg-choco text-cream p-7 min-h-[calc(100vh-120px)] flex flex-col overflow-hidden">
          <Seal tone="choco" className="absolute -right-10 -top-10 w-40 opacity-30" spin />
          <p className="num text-[12px] uppercase tracking-[0.16em] text-cream/55">Tu caja</p>
          <h1 className="display text-[44px] mt-2">{box.name}</h1>
          <p className="text-cream/65 text-[15px]">{box.when} · {size} cookies</p>
          <div className="mt-6"><SizePicker dark id="d" /></div>
          <div className="flex-1 grid place-items-center py-8">
            <div className="w-full max-w-[380px] rounded-[28px] bg-[#2A140C] p-5 shadow-[inset_0_12px_30px_rgba(0,0,0,.45)]">
              <Slots />
            </div>
          </div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="num text-[12px] uppercase tracking-[0.16em] text-cream/55">Total</p>
              <p className="num text-[40px] font-bold leading-none mt-1">{money(box.price)}</p>
            </div>
            <div className="text-right">
              <p className="num text-[20px] font-bold">{n}/{size}</p>
              {n > 0 && <button onClick={clear} className="mt-1 inline-flex items-center gap-1 text-[13px] text-cream/60 hover:text-blush"><Trash2 className="w-3.5 h-3.5" /> Vaciar</button>}
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-cream/10 mb-5 overflow-hidden"><motion.div className="h-full bg-blush rounded-full" animate={{ width: `${(n / size) * 100}%` }} /></div>
          {cta}
        </motion.div>
      </aside>

      {/* Sabores */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-8">
          <div>
            <p className="num text-[12px] uppercase tracking-[0.16em] text-choco/55">Paso 1 · Llená tu caja</p>
            <h2 className="display text-[clamp(44px,5vw,76px)] mt-2">Elegí tus sabores</h2>
          </div>
          <div className="lg:hidden"><SizePicker id="m" /></div>
          <p className="hidden lg:block text-choco/65 max-w-[300px] text-[15px]">Tocá Agregar y mirá cómo cae en tu caja. Tocá una cookie de la caja para sacarla.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {FLAVOURS.map((f, i) => <FlavourCard key={f.id} f={f} i={i} onFull={onFull} />)}
          <div className="rounded-3xl border-2 border-dashed border-choco/15 p-6 flex flex-col justify-center gap-2 text-choco/60 max-sm:hidden">
            <p className="display text-[26px] text-choco">¿Algo especial?</p>
            <p className="text-[14px]">Cookies con nombre, cajas para eventos o sin TACC: escribime por Instagram y lo armamos.</p>
          </div>
        </div>
      </section>

      {/* Barra móvil */}
      <motion.div animate={shake} className="lg:hidden fixed inset-x-0 bottom-0 z-40 px-3 pb-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <div className="rounded-[28px] bg-choco text-cream p-3 shadow-[0_-10px_40px_-10px_rgba(59,30,20,.5)]">
          <div className="flex items-center justify-between px-2 mb-2.5">
            <span className="num text-[13px]"><b>{box.name}</b> · {n}/{size}</span>
            <span className="num text-[17px] font-bold">{money(box.price)}</span>
          </div>
          <div className="px-1 mb-3"><Slots compact /></div>
          {cta}
        </div>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed left-1/2 -translate-x-1/2 bottom-48 lg:bottom-8 z-50 rounded-full bg-choco text-cream px-5 py-3 text-[14px] font-semibold shadow-xl">
            Tu caja está llena 🍪 Cambiá el tamaño o sacá una.
          </motion.div>
        )}
      </AnimatePresence>
      <Checkout />
    </main>
  );
}
