"use client";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";
import type { BoxSize } from "@/data/config";

export function SizePicker({ dark = false, id }: { dark?: boolean; id: string }) {
  const { size, setSize } = useCart();
  return (
    <div className={`inline-flex p-1 rounded-full ${dark ? "bg-cream/10" : "bg-choco/[.06]"}`} role="radiogroup" aria-label="Tamaño de caja">
      {([4, 6, 12] as BoxSize[]).map((n) => (
        <button key={n} role="radio" aria-checked={size === n} onClick={() => setSize(n)} className={`relative num font-bold text-[17px] w-14 h-10 rounded-full transition-colors ${size === n ? (dark ? "text-choco" : "text-cream") : dark ? "text-cream/70" : "text-choco/70"}`}>
          {size === n && <motion.span layoutId={"size-" + id} className={`absolute inset-0 rounded-full ${dark ? "bg-blush" : "bg-choco"}`} transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
          <span className="relative">{n}</span>
        </button>
      ))}
    </div>
  );
}
