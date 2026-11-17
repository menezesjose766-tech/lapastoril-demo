"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "@/components/ui/Cookie";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export function Slots({ compact = false }: { compact?: boolean }) {
  const { size, items, removeAt } = useCart();
  const pending = useUI((s) => s.pending);
  const cols = compact ? size : size === 4 ? 2 : size === 6 ? 3 : 4;
  return (
    <motion.div layout className={`grid ${compact ? "gap-1" : "gap-2.5 md:gap-3"}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {Array.from({ length: size }, (_, i) => {
        const id = items[i];
        const show = id && !pending.includes(i);
        return (
          <motion.button
            layout
            key={i}
            data-slot={i}
            onClick={() => id && removeAt(i)}
            aria-label={id ? `Quitar cookie del hueco ${i + 1}` : `Hueco ${i + 1} vacío`}
            className={`relative aspect-square rounded-full ${compact ? "border-[1.5px]" : "border-2"} border-dashed ${show ? "border-transparent" : "border-cream/30"} grid place-items-center group`}
          >
            {!show && !compact && <span className="num text-[11px] text-cream/30">{i + 1}</span>}
            <AnimatePresence>
              {show && (
                <motion.div key={id + i} className="absolute inset-[-4%]" initial={{ scale: 1.25, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90, opacity: 0 }} transition={{ type: "spring", stiffness: 420, damping: 18 }}>
                  <Cookie id={id} seed={"slot" + i} className="w-full h-full" />
                  {!compact && <span className="absolute inset-0 rounded-full bg-choco/50 opacity-0 group-hover:opacity-100 transition grid place-items-center text-cream text-xl">×</span>}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
