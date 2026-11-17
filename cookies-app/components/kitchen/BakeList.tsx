"use client";
import { motion } from "framer-motion";
import { FLAVOURS } from "@/data/flavours";
import type { Order } from "@/store/orders";
import { Cookie } from "@/components/ui/Cookie";

export function BakeList({ orders }: { orders: Order[] }) {
  const active = orders.filter((o) => o.status === "new" || o.status === "baking");
  const rows = FLAVOURS.map((f) => {
    const toBake = active.filter((o) => o.status === "new").flatMap((o) => o.items).filter((x) => x === f.id).length;
    const inOven = active.filter((o) => o.status === "baking").flatMap((o) => o.items).filter((x) => x === f.id).length;
    return { f, toBake, inOven, total: toBake + inOven };
  }).sort((a, b) => b.total - a.total);
  const max = Math.max(1, ...rows.map((r) => r.total));
  const sum = rows.reduce((s, r) => s + r.total, 0);
  return (
    <div className="bg-white rounded-3xl p-5 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h2 className="display text-[34px] md:text-[44px]">Lista de horneado</h2>
          <p className="text-choco/60 text-[14px] mt-2">Suma automática de los pedidos nuevos y en el horno.</p>
        </div>
        <div className="text-right"><p className="num text-[44px] font-bold leading-none">{sum}</p><p className="num text-[12px] uppercase tracking-[0.14em] text-choco/55">cookies en total</p></div>
      </div>
      <div className="flex gap-4 text-[12px] mb-4 num">
        <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded bg-blush" /> por hornear</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded bg-butter" /> en el horno</span>
      </div>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <motion.div layout key={r.f.id} className="grid grid-cols-[44px_1fr_auto] md:grid-cols-[48px_190px_1fr_56px] items-center gap-3 rounded-2xl bg-cream/60 p-2.5">
            <Cookie id={r.f.id} seed="bake" className="w-11 h-11" />
            <span className="font-semibold text-[15px] truncate">{r.f.name}</span>
            <div className="max-md:col-span-3 max-md:order-last h-3.5 rounded-full bg-cream overflow-hidden flex">
              <motion.div className="h-full bg-blush" initial={{ width: 0 }} animate={{ width: `${(r.toBake / max) * 100}%` }} transition={{ delay: i * 0.04, type: "spring", stiffness: 120, damping: 20 }} />
              <motion.div className="h-full bg-butter" initial={{ width: 0 }} animate={{ width: `${(r.inOven / max) * 100}%` }} transition={{ delay: i * 0.04 + 0.1, type: "spring", stiffness: 120, damping: 20 }} />
            </div>
            <motion.span key={r.total} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="num text-[24px] font-bold text-right">{r.total}</motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
