"use client";
import { motion } from "framer-motion";
import { BOXES, money, type BoxSize } from "@/data/config";
import { ClosedBox } from "@/components/ui/Boxes";
import { useCart } from "@/store/cart";
import { useGo } from "@/components/ui/TLink";
import { Arrow, pill } from "@/components/ui/Button";

export default function Sizes() {
  const setSize = useCart((s) => s.setSize);
  const go = useGo();
  return (
    <section id="cajas" className="mx-auto max-w-[1440px] px-4 md:px-8 py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="num text-[13px] uppercase tracking-[0.18em] mb-4">Tienda</p>
          <h2 className="display text-[clamp(48px,6.4vw,100px)]">Elegí el tamaño.</h2>
        </div>
        <p className="max-w-[340px] text-[17px] leading-snug text-choco/75">Tres cajas, siete sabores. Mezclalos como quieras: cada hueco es una cookie.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {([4, 6, 12] as BoxSize[]).map((n, i) => {
          const b = BOXES[n];
          const hot = n === 6;
          return (
            <motion.button
              key={n}
              onClick={() => { setSize(n); go("/tienda"); }}
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className={`group relative text-left rounded-3xl overflow-hidden p-6 md:p-7 min-h-[460px] flex flex-col ${hot ? "bg-blush" : "bg-white"}`}
            >
              <span className="absolute -right-4 -top-10 display num text-[clamp(220px,22vw,330px)] leading-none text-choco/[.07] select-none tracking-[-0.08em]">{n}</span>
              <div className="flex justify-between items-start relative">
                <span className="num text-[12px] uppercase tracking-[0.14em] rounded-full border border-choco/20 px-3 py-1">{b.when}</span>
                {hot && <span className="num text-[11px] uppercase tracking-[0.14em] rounded-full bg-choco text-cream px-3 py-1">La más pedida</span>}
              </div>
              <ClosedBox size={n} className="relative my-auto py-6 group-hover:[&>div]:scale-[1.04] [&>div]:transition-transform [&>div]:duration-500" />
              <div className="relative">
                <h3 className="display text-[40px]">{b.name}</h3>
                <p className="mt-1 text-choco/70">{b.blurb}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="num text-[28px] font-bold tracking-tight">{n} × {money(b.price)}</span>
                  <span className={`${pill} bg-choco text-cream pl-4 pr-1 py-1 text-[14px]`}>Elegir <Arrow className="w-8 h-8" /></span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
