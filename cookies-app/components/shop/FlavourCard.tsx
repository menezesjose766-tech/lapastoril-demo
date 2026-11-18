"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Minus, Plus } from "lucide-react";
import { Cookie } from "@/components/ui/Cookie";
import type { Flavour } from "@/data/flavours";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export function FlavourCard({ f, i, onFull }: { f: Flavour; i: number; onFull: () => void }) {
  const img = useRef<HTMLDivElement>(null);
  const count = useCart((s) => s.items.filter((x) => x === f.id).length);
  const add = useCart((s) => s.add);
  const removeOne = useCart((s) => s.removeOne);
  const launch = useUI((s) => s.launch);

  const onAdd = () => {
    const slot = add(f.id);
    if (slot < 0) return onFull();
    const r = img.current!.getBoundingClientRect();
    launch({ flavourId: f.id, slot, from: { x: r.left, y: r.top, w: r.width } });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl p-4 md:p-5 flex md:flex-col gap-4 items-center md:items-stretch"
      style={{ background: f.bg }}
    >
      {count > 0 && (
        <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 md:top-4 md:right-4 num text-[13px] font-bold bg-choco text-cream rounded-full min-w-7 h-7 px-2 grid place-items-center z-10">
          ×{count}
        </motion.span>
      )}
      <div ref={img} className="w-[38%] md:w-[78%] md:mx-auto shrink-0 aspect-square transition-transform duration-700 ease-out group-hover:rotate-[24deg] group-hover:scale-105">
        <Cookie id={f.id} seed="card" className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col md:mt-2">
        <span className="num text-[11px] uppercase tracking-[0.14em] text-choco/50">{String(i + 1).padStart(2, "0")}</span>
        <h3 className="display text-[24px] md:text-[30px] leading-[.95] mt-1">{f.name}</h3>
        <p className="text-[14px] text-choco/70 mt-2 line-clamp-3 md:min-h-[63px]">{f.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          {count === 0 ? (
            <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-full bg-choco text-cream pl-4 pr-1.5 py-1.5 font-semibold text-[14px] active:scale-95 transition">
              Agregar <span className="w-7 h-7 rounded-full bg-blush text-choco grid place-items-center"><Plus className="w-4 h-4" /></span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-full bg-choco text-cream p-1">
              <button onClick={() => removeOne(f.id)} aria-label={`Quitar ${f.name}`} className="w-8 h-8 rounded-full bg-cream/10 grid place-items-center active:scale-90 transition"><Minus className="w-4 h-4" /></button>
              <span className="num font-bold w-8 text-center">{count}</span>
              <button onClick={onAdd} aria-label={`Sumar ${f.name}`} className="w-8 h-8 rounded-full bg-blush text-choco grid place-items-center active:scale-90 transition"><Plus className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
