"use client";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { MENU as FLAVOURS } from "@/data/flavours";
import { Cookie } from "@/components/ui/Cookie";
import { useCart } from "@/store/cart";
import { useGo } from "@/components/ui/TLink";
import { Arrow, pill } from "@/components/ui/Button";

export default function Flavours() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.min(FLAVOURS.length - 1, Math.max(0, Math.floor(v * FLAVOURS.length)))));
  const spin = useTransform(scrollYProgress, [0, 1], [0, 540]);
  const add = useCart((s) => s.add);
  const setSize = useCart((s) => s.setSize);
  const go = useGo();
  const f = FLAVOURS[i];

  const jump = (k: number) => {
    const el = ref.current!;
    const top = el.offsetTop + ((k + 0.5) / FLAVOURS.length) * (el.offsetHeight - innerHeight);
    scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="sabores" style={{ height: `${FLAVOURS.length * 85}vh` }} className="relative">
      <motion.div className="sticky top-0 h-screen overflow-hidden" animate={{ backgroundColor: f.bg }} transition={{ duration: 0.6 }}>
        <div className="mx-auto max-w-[1440px] h-full px-4 md:px-8 pt-20 pb-8 grid grid-rows-[auto_1fr_auto] lg:grid-rows-1 lg:grid-cols-[1fr_1.1fr_auto] gap-4 lg:gap-8 items-center">
          <div className="relative z-10">
            <p className="num text-[13px] uppercase tracking-[0.18em] mb-3 lg:mb-6 flex items-center gap-3">
              Sabores
              <span className="font-bold text-choco"><AnimatePresence mode="popLayout"><motion.span key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="inline-block">{String(i + 1).padStart(2, "0")}</motion.span></AnimatePresence>/{String(FLAVOURS.length).padStart(2, "0")}</span>
            </p>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h2 key={f.id} className="display text-[clamp(52px,7.6vw,128px)]" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}>
                  {f.name}
                </motion.h2>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={f.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="hidden lg:block">
                <p className="mt-6 text-[18px] max-w-[420px] leading-snug text-choco/80">{f.desc}</p>
                <button onClick={() => { if (add(f.id) < 0) setSize(12), add(f.id); go("/tienda"); }} className={`${pill} mt-8 bg-choco text-cream pl-6 pr-1.5 py-1.5 text-[16px]`}>Sumar a una caja <Arrow /></button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative h-full min-h-0 grid place-items-center">
            <div className="absolute w-[min(78vw,62vh,560px)] aspect-square rounded-full bg-white/40" />
            <AnimatePresence mode="popLayout">
              <motion.div key={f.id} className="relative w-[min(72vw,56vh,520px)] aspect-square" initial={{ scale: 0.4, opacity: 0, rotate: -90, y: 80 }} animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }} exit={{ scale: 0.6, opacity: 0, rotate: 60, y: -80 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <motion.div style={{ rotate: spin }} className="w-full h-full">
                  <Cookie id={f.id} seed="hero" className="w-full h-full drop-shadow-[0_40px_40px_rgba(59,30,20,.35)]" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden">
              <p className="text-[16px] leading-snug text-choco/80">{f.desc}</p>
              <button onClick={() => { if (add(f.id) < 0) setSize(12), add(f.id); go("/tienda"); }} className={`${pill} mt-4 bg-choco text-cream pl-6 pr-1.5 py-1.5 text-[16px]`}>Sumar a una caja <Arrow /></button>
            </motion.div>
          </AnimatePresence>

          <div className="absolute right-3 lg:static top-1/2 -translate-y-1/2 lg:translate-y-0 flex flex-col gap-3">
            {FLAVOURS.map((x, k) => (
              <button key={x.id} onClick={() => jump(k)} aria-label={x.name} className="group flex items-center justify-end gap-3">
                <span className={`hidden lg:block num text-[12px] transition ${k === i ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}>{x.short}</span>
                <span className={`block rounded-full transition-all duration-300 ${k === i ? "w-3 h-3 bg-choco" : "w-2 h-2 bg-choco/25"}`} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
