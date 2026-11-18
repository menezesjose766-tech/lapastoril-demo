"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SPA, usePath, useRoute } from "@/lib/route";
import { useEffect, useRef } from "react";
import { useUI } from "@/store/ui";
import { Seal } from "@/components/ui/Seal";

const ease = [0.76, 0, 0.24, 1] as const;

/** Dos solapas de caja (arriba/abajo) que se cierran, navegan y se vuelven a abrir. */
export default function BoxTransition() {
  const { phase, target, setPhase } = useUI();
  const router = useRouter();
  const pathname = usePath();
  const navigated = useRef<string | null>(null);

  useEffect(() => {
    if (!SPA && phase === "closing" && target) router.prefetch(target.split("#")[0] || "/");
  }, [phase, target, router]);

  // cuando cambia la ruta después de cerrar, abrimos
  useEffect(() => {
    if (navigated.current && pathname === (navigated.current.split("#")[0] || "/")) {
      navigated.current = null;
      const hash = useUI.getState().target?.split("#")[1];
      requestAnimationFrame(() => {
        if (hash) document.getElementById(hash)?.scrollIntoView();
        else window.scrollTo(0, 0);
        setTimeout(() => setPhase("opening"), 140);
      });
    }
  }, [pathname, setPhase]);

  const closed = phase === "closing";
  const show = phase !== "idle";

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[90] pointer-events-auto" style={{ perspective: 1400 }} initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            className="absolute left-0 right-0 top-0 h-1/2 bg-choco origin-top"
            initial={{ rotateX: -92 }}
            animate={{ rotateX: closed ? 0 : -92 }}
            transition={{ duration: 0.6, ease }}
            style={{ boxShadow: "inset 0 -30px 60px -30px rgba(0,0,0,.5)" }}
            onAnimationComplete={() => {
              const st = useUI.getState();
              if (st.phase === "closing" && st.target && !navigated.current) {
                navigated.current = st.target;
                const path = st.target.split("#")[0] || "/";
                if (path === pathname) { navigated.current = null; setTimeout(() => setPhase("opening"), 100); }
                else if (SPA) useRoute.getState().set(path);
                else router.push(path);
              } else if (st.phase === "opening") setPhase("idle");
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-px bg-black/30" />
          </motion.div>
          <motion.div
            className="absolute left-0 right-0 bottom-0 h-1/2 bg-choco origin-bottom"
            initial={{ rotateX: 92 }}
            animate={{ rotateX: closed ? 0 : 92 }}
            transition={{ duration: 0.6, ease }}
            style={{ boxShadow: "inset 0 30px 60px -30px rgba(0,0,0,.5)" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 w-36 h-36 -ml-18 -mt-18"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: closed ? 1 : 0, rotate: closed ? 0 : 40 }}
            transition={{ duration: 0.5, ease, delay: closed ? 0.32 : 0 }}
          >
            <Seal className="w-full h-full drop-shadow-xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
