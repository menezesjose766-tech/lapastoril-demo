"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Cookie } from "@/components/ui/Cookie";
import { ClosedBox } from "@/components/ui/Boxes";
import { TLink } from "@/components/ui/TLink";
import { Arrow, pill } from "@/components/ui/Button";
import { Bike, Flame } from "lucide-react";

const FILL = ["red-velvet", "clasica", "oreo", "frambuesa", "dulce-de-leche", "choco-rosa"];

function BoxFillMock() {
  return (
    <div className="rounded-3xl bg-choco p-4 w-[min(260px,70%)] shadow-2xl">
      <div className="grid grid-cols-3 gap-2">
        {FILL.map((id, i) => (
          <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-cream/25 relative">
            <motion.div className="absolute inset-0.5" animate={{ scale: [0, 0, 1, 1, 0], opacity: [0, 0, 1, 1, 0] }} transition={{ duration: 6, repeat: Infinity, times: [0, i * 0.08 + 0.02, i * 0.08 + 0.1, 0.9, 1] }}>
              <Cookie id={id} seed={"m" + i} className="w-full h-full" />
            </motion.div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-cream num text-[13px]"><span>6 / 6</span><span className="text-blush">$17.500</span></div>
    </div>
  );
}

function TicketMock() {
  return (
    <motion.div className="bg-white rounded-2xl p-4 w-[min(270px,74%)] shadow-[0_30px_60px_-20px_rgba(59,30,20,.4)] -rotate-3" animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
      <div className="flex justify-between items-center">
        <span className="font-bold text-[18px]">Ruby</span>
        <motion.span className="num text-[11px] font-bold bg-blush rounded-full px-2 py-0.5" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>NUEVO</motion.span>
      </div>
      <p className="text-[13px] text-choco/60 mt-0.5">Retiro · 10 a 12 hs</p>
      <div className="flex -space-x-2 mt-3">{FILL.map((id, i) => <Cookie key={i} id={id} seed={"t" + i} className="w-9 h-9" />)}</div>
      <p className="mt-3 text-[12px] bg-butter/60 rounded-lg px-2 py-1">Es una caja de cumple 🎂</p>
      <div className="mt-3 flex justify-between items-center num text-[13px]"><span className="text-choco/50">#326</span><span className="bg-choco text-cream rounded-full px-3 py-1.5 text-[12px] font-sans font-semibold">Empezar a hornear →</span></div>
    </motion.div>
  );
}

function BakeMock() {
  const [t, setT] = useState(720);
  useEffect(() => { const i = setInterval(() => setT((v) => (v <= 0 ? 720 : v - 7)), 60); return () => clearInterval(i); }, []);
  return (
    <div className="relative w-[min(280px,76%)] aspect-square rounded-3xl bg-[#2A140C] overflow-hidden grid place-items-center">
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 70%, rgba(255,140,60,.55), transparent 70%)" }} />
      <div className="absolute inset-x-6 bottom-8 h-1.5 rounded-full bg-[#5A3324]" />
      <div className="relative grid grid-cols-2 gap-4 w-[64%] -mt-6">
        {["clasica", "marshmallow", "red-velvet", "dulce-de-leche"].map((id, i) => (
          <motion.div key={id} animate={{ scale: [0.86, 1, 0.86] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2 }}>
            <Cookie id={id} seed={"b" + i} className="w-full" />
          </motion.div>
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="absolute w-1 h-10 rounded-full bg-orange-200/40 blur-[1px]" style={{ left: `${30 + i * 20}%`, top: "12%" }} animate={{ y: [10, -20], opacity: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5 }} />
      ))}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-cream text-choco rounded-full px-2.5 py-1 num text-[13px] font-bold">
        <Flame className="w-3.5 h-3.5 text-orange-600" /> {String(Math.floor(t / 60)).padStart(2, "0")}:{String(t % 60).padStart(2, "0")}
      </div>
    </div>
  );
}

function PackMock() {
  return (
    <div className="w-[min(300px,80%)] flex flex-col items-center gap-4">
      <motion.div className="w-full" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity }}><ClosedBox size={6} /></motion.div>
      <div className="flex items-center gap-2 text-[13px] num"><Bike className="w-4 h-4" /> Retiro gratis · Envío $2.000</div>
      <TLink href="/tienda" className={`${pill} bg-choco text-cream pl-5 pr-1.5 py-1.5 text-[15px]`}>Armá tu caja <Arrow className="w-8 h-8" /></TLink>
    </div>
  );
}

const STEPS = [
  { n: "01", t: "Armá tu caja", d: "Elegí el tamaño y llenala con tus sabores, hueco por hueco.", mock: <BoxFillMock />, bg: "bg-white" },
  { n: "02", t: "Llega al tablero de cocina", d: "Tu pedido aparece al instante en mi tablero, con tu nota y tu horario.", mock: <TicketMock />, bg: "bg-blush" },
  { n: "03", t: "Horneada el día que elegís", d: "Nada de stock: se hornea esa mañana, para que llegue tibia y gooey.", mock: <BakeMock />, bg: "bg-cream-2" },
  { n: "04", t: "Empacada a mano, retiro o envío", d: "Caja cerrada con sello. La retirás o te la llevo a tu casa.", mock: <PackMock />, bg: "bg-white" },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const m = () => track.current && setDist(Math.max(0, track.current.scrollWidth - innerWidth));
    m(); addEventListener("resize", m); return () => removeEventListener("resize", m);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} id="como" className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <motion.div ref={track} style={{ x }} className="flex gap-5 px-4 md:px-8 items-stretch w-max">
          <div className="w-[82vw] md:w-[36vw] max-w-[520px] flex flex-col justify-between py-4 pr-6">
            <p className="num text-[13px] uppercase tracking-[0.18em]">Cómo funciona</p>
            <h2 className="display text-[clamp(46px,5.4vw,88px)]">De un toque en tu celu a una caja en tu puerta.</h2>
            <p className="num text-[13px] text-choco/60">Deslizá →</p>
          </div>
          {STEPS.map((s) => (
            <div key={s.n} className={`${s.bg} rounded-3xl w-[82vw] md:w-[40vw] max-w-[560px] h-[min(70vh,620px)] p-6 md:p-8 flex flex-col`}>
              <div className="flex justify-between items-start">
                <span className="display num text-[64px] md:text-[84px] text-choco/15 tracking-[-0.06em]">{s.n}</span>
              </div>
              <div className="flex-1 grid place-items-center">{s.mock}</div>
              <h3 className="display text-[30px] md:text-[36px] leading-[.95]">{s.t}</h3>
              <p className="mt-2 text-choco/70 max-w-[380px]">{s.d}</p>
            </div>
          ))}
        </motion.div>
        <div className="mx-4 md:mx-8 mt-8 h-[3px] rounded-full bg-choco/10 overflow-hidden"><motion.div className="h-full bg-choco" style={{ width: bar }} /></div>
      </div>
    </section>
  );
}
