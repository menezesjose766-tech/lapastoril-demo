"use client";
import { motion } from "framer-motion";
import { Bike, Check, Clock, Store } from "lucide-react";
import type { Order } from "@/store/orders";
import { useOrders } from "@/store/orders";
import { Cookie } from "@/components/ui/Cookie";
import { money } from "@/data/config";

const ACTION = {
  new: { label: "Empezar a hornear →", cls: "bg-choco text-cream" },
  baking: { label: "Marcar listo →", cls: "bg-butter text-choco" },
  ready: { label: "Entregado ✓", cls: "bg-mint text-choco" },
  done: { label: "", cls: "" },
} as const;

export function OrderCard({ o, fresh }: { o: Order; fresh: boolean }) {
  const advance = useOrders((s) => s.advance);
  const a = ACTION[o.status];
  const mins = Math.max(0, Math.round((Date.now() - o.createdAt) / 60000));
  return (
    <motion.article
      layout
      layoutId={o.id}
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, x: 60, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={`relative bg-white rounded-2xl p-4 shadow-[0_1px_0_rgba(59,30,20,.06),0_10px_30px_-18px_rgba(59,30,20,.35)] ${fresh ? "ring-2 ring-blush-2" : ""}`}
    >
      {fresh && <motion.span className="absolute -inset-1 rounded-[20px] ring-4 ring-blush" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2.4, repeat: 2 }} />}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-[17px] truncate">{o.name}</h3>
          <p className="text-[13px] text-choco/60 flex items-center gap-1.5 mt-0.5 flex-wrap">
            {o.mode === "pickup" ? <Store className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
            {o.mode === "pickup" ? "Retiro" : "Envío"}
            <span className="opacity-40">·</span>
            <Clock className="w-3.5 h-3.5" /> {o.dayLabel !== "Hoy" ? o.dayLabel + " · " : ""}{o.slot}
          </p>
        </div>
        <span className="num text-[11px] text-choco/45 shrink-0 pt-1">{mins < 1 ? "recién" : mins < 60 ? `hace ${mins}m` : `hace ${Math.floor(mins / 60)}h`}</span>
      </div>
      <div className="flex flex-wrap gap-0.5 mt-3">
        {o.items.map((id, i) => <Cookie key={i} id={id} seed={"k" + i} className={o.items.length > 6 ? "w-8 h-8" : "w-10 h-10"} />)}
      </div>
      {o.note && <p className="mt-3 text-[13px] bg-butter/55 rounded-lg px-2.5 py-1.5 leading-snug">📝 {o.note}</p>}
      <div className="mt-3 pt-3 border-t border-cream flex items-center justify-between gap-2">
        <div className="num text-[13px]"><span className="text-choco/45">#{o.num}</span> <b className="ml-1">{money(o.total)}</b></div>
        <button onClick={() => advance(o.id)} className={`rounded-full px-3.5 py-2 text-[13px] font-bold active:scale-95 transition ${a.cls}`}>{a.label}</button>
      </div>
      <p className="num text-[11px] text-choco/40 mt-2 truncate">{o.contact} · {o.items.length} cookies</p>
    </motion.article>
  );
}

export { Check };
