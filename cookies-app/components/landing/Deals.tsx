"use client";
import { motion } from "framer-motion";
import { BOXES, BRAND, DELIVERY_FEE, money } from "@/data/config";
import { IgIcon } from "@/components/ui/Seal";

export default function Deals() {
  const rows = [
    { k: "Lunes y martes", v: <>La cajita. Cuatro por <b className="num">{money(BOXES[4].price)}</b>.</> },
    { k: "Retiro o envío", v: <>Retirás gratis o te la llevamos por <b className="num">{money(DELIVERY_FEE)}</b>.</> },
    { k: "¿Preferís por DM?", v: <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4 decoration-blush hover:text-blush"><IgIcon /> Escribime en Instagram</a> },
  ];
  return (
    <section id="promos" className="bg-choco text-cream">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-20 md:py-28 grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-end">
        <div>
          <p className="num text-[13px] uppercase tracking-[0.18em] text-blush mb-6">Las promos de verdad</p>
          <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="display text-[clamp(56px,8.6vw,140px)]">
            Seis por <span className="text-blush num tracking-[-0.06em]">{money(BOXES[6].price)}</span>, todos los días.
          </motion.h2>
        </div>
        <div className="divide-y divide-cream/15 border-y border-cream/15">
          {rows.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="py-6 grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] gap-4">
              <span className="num text-[12px] uppercase tracking-[0.14em] text-cream/55 pt-1">{r.k}</span>
              <span className="text-[19px] leading-snug">{r.v}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
