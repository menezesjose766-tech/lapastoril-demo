"use client";
import { motion, AnimatePresence, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Seal";

// Mordiscos: posición sobre el borde superior derecho del círculo (viewBox 200)
const BITES = [
  { at: 34, cx: 172, cy: 46, r: 30 },
  { at: 58, cx: 142, cy: 14, r: 28 },
  { at: 80, cx: 190, cy: 92, r: 26 },
];

export default function Preloader() {
  const [show, setShow] = useState<boolean | null>(null);
  const [n, setN] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("lcc-loaded") === "1"; } catch {}
    if (seen || new URLSearchParams(location.search).has("nointro")) { setShow(false); return; }
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const c = animate(0, 100, { duration: 2.6, ease: [0.45, 0, 0.2, 1], onUpdate: (v) => setN(Math.round(v)) });
    c.then(() => {
      setTimeout(() => setOpen(true), 250);
      setTimeout(() => {
        setShow(false);
        document.documentElement.style.overflow = "";
        try { sessionStorage.setItem("lcc-loaded", "1"); } catch {}
      }, 1300);
    });
    return () => c.stop();
  }, []);

  const bitten = BITES.filter((b) => n >= b.at);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100] pointer-events-auto" style={{ perspective: 1600 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}>
          {/* dos mitades rosas que se abren como una caja */}
          {[0, 1].map((half) => (
            <motion.div
              key={half}
              className={`absolute inset-x-0 h-1/2 bg-blush overflow-hidden ${half ? "bottom-0 origin-bottom" : "top-0 origin-top"}`}
              animate={open ? { rotateX: half ? 95 : -95 } : { rotateX: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            />
          ))}
          <motion.div className="absolute inset-0" animate={open ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.35 }}>
            <div className="absolute inset-0 grid place-items-center">
              <motion.div className="relative w-[min(56vw,260px)] aspect-square" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                  <defs>
                    <mask id="bite-mask">
                      <rect width="200" height="200" fill="#fff" />
                      {bitten.map((b, i) => (
                        <g key={i}>
                          <circle cx={b.cx} cy={b.cy} r={b.r} fill="#000" />
                          <circle cx={b.cx - b.r * 0.7} cy={b.cy + b.r * 0.55} r={b.r * 0.32} fill="#000" />
                          <circle cx={b.cx + b.r * 0.55} cy={b.cy - b.r * 0.75} r={b.r * 0.3} fill="#000" />
                        </g>
                      ))}
                    </mask>
                  </defs>
                  <g mask="url(#bite-mask)">
                    <circle cx="100" cy="100" r="96" fill="#3B1E14" />
                    {/* chips */}
                    {[[60, 70, 6], [130, 120, 7], [80, 140, 5], [150, 70, 5], [100, 40, 4]].map(([x, y, r], i) => (
                      <circle key={i} cx={x} cy={y} r={r} fill="#5A3324" />
                    ))}
                  </g>
                </svg>
                <div className="absolute inset-0 grid place-items-center text-blush text-center">
                  <Logo className="text-[clamp(22px,5.2vw,30px)] max-w-[70%] block" />
                </div>
                {/* migas que caen en cada mordisco */}
                {bitten.map((b, i) => (
                  <div key={i} className="absolute" style={{ left: `${(b.cx / 200) * 100}%`, top: `${(b.cy / 200) * 100}%` }}>
                    {Array.from({ length: 7 }, (_, k) => (
                      <motion.span
                        key={k}
                        className="absolute block rounded-[3px] bg-choco"
                        style={{ width: 4 + (k % 3) * 3, height: 4 + (k % 2) * 3 }}
                        initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                        animate={{ x: (k - 3) * 9 + 10, y: 120 + k * 22, opacity: 0, rotate: k * 70 }}
                        transition={{ duration: 1.1 + k * 0.05, ease: [0.4, 0, 0.9, 0.6] }}
                      />
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
            <div className="absolute left-5 md:left-10 bottom-4 md:bottom-6 display num text-choco text-[clamp(88px,18vw,240px)] leading-none tracking-[-0.06em]">
              {n}<span className="text-[0.35em] align-top ml-1">%</span>
            </div>
            <div className="absolute right-5 md:right-10 bottom-6 md:bottom-10 num text-choco text-sm md:text-base uppercase tracking-[0.18em]">amasando los chunks…</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
