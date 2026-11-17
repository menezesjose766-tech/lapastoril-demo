"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TLink } from "@/components/ui/TLink";
import { CookieStack, OpenBox } from "@/components/ui/Boxes";
import { Arrow, pill } from "@/components/ui/Button";
import { BRAND } from "@/data/config";

const words = ["Gigantes,", "rellenas,", "caseras."];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBox = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yStack = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const rot = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <section ref={ref} className="relative bg-blush overflow-hidden pt-24 md:pt-28 pb-14 md:pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="num text-[13px] uppercase tracking-[0.18em] mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-choco" /> Horneadas a pedido · {BRAND.city}
          </motion.p>
          <h1 className="display text-[clamp(64px,10.4vw,168px)]">
            {words.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}>
                  {i === 1 ? <span className="italic font-[family-name:var(--font-display)] font-bold">{w}</span> : w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mt-7 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <TLink href="/tienda" className={`${pill} bg-choco text-cream pl-7 pr-2 py-2 text-[17px] w-fit hover:shadow-[0_18px_40px_-14px_rgba(59,30,20,.8)]`}>
              Armá tu caja <Arrow />
            </TLink>
            <p className="text-[17px] max-w-[300px] leading-snug">Cookies rellenas, horneadas a pedido en {BRAND.city}. Elegí tus sabores y te avisamos el día.</p>
          </motion.div>
        </div>

        <div className="relative h-[min(92vw,560px)] lg:h-[600px]">
          <motion.div style={{ y: yBox }} className="absolute right-0 top-[20%] w-[78%] lg:w-[80%]" initial={{ opacity: 0, x: 60, rotate: 6 }} animate={{ opacity: 1, x: 0, rotate: 4 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <OpenBox ids={["red-velvet", "clasica", "oreo", "frambuesa", "dulce-de-leche", "choco-rosa"]} />
          </motion.div>
          <motion.div style={{ y: yStack, rotate: rot }} className="absolute left-0 bottom-0 w-[44%]" initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <CookieStack ids={["clasica", "marshmallow", "red-velvet", "choco-rosa"]} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* cinta inferior */}
      <div className="mt-10 md:mt-6 border-y border-choco/15 overflow-hidden py-3">
        <div className="flex w-max gap-10 animate-[marquee_28s_linear_infinite] num uppercase tracking-[0.14em] text-[13px]">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10">
              {["Horneadas el día que elegís", "✦", "Manteca de verdad", "✦", "30 por día", "✦", "Retiro gratis", "✦", "Envíos en Tandil", "✦", "Pagás por DM", "✦"].map((t, i) => <span key={i}>{t}</span>)}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee{to{transform:translateX(-50%)}}`}</style>
    </section>
  );
}
