"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUI, type Flight } from "@/store/ui";
import { Cookie } from "@/components/ui/Cookie";

/** Busca el hueco visible de la caja con ese índice (desktop o barra móvil). */
function slotRect(i: number) {
  const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-slot="${i}"]`));
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.bottom > 0 && r.top < innerHeight) return r;
  }
  const r = els[0]?.getBoundingClientRect();
  return r && r.width > 0 ? r : null;
}

function Fly({ f }: { f: Flight }) {
  const land = useUI((s) => s.land);
  const [to, setTo] = useState<DOMRect | null>(null);
  useEffect(() => {
    const r = slotRect(f.slot);
    if (!r) land(f.id);
    else setTo(r);
  }, [f, land]);
  if (!to) return null;
  const dx = to.left + to.width / 2 - (f.from.x + f.from.w / 2);
  const dy = to.top + to.height / 2 - (f.from.y + f.from.w / 2);
  const s = (to.width * 0.86) / f.from.w;
  return (
    <motion.div
      className="fixed z-[80] pointer-events-none"
      style={{ left: f.from.x, top: f.from.y, width: f.from.w, height: f.from.w }}
      initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
      animate={{ x: [0, dx * 0.45, dx], y: [0, dy * 0.45 - 140, dy], scale: [1, 1.08, s], rotate: [0, -25, 200] }}
      transition={{ duration: 0.75, ease: [0.5, 0, 0.3, 1], times: [0, 0.45, 1] }}
      onAnimationComplete={() => land(f.id)}
    >
      <Cookie id={f.flavourId} seed="fly" className="w-full h-full drop-shadow-2xl" />
    </motion.div>
  );
}

export default function FlyLayer() {
  const flights = useUI((s) => s.flights);
  return <>{flights.map((f) => <Fly key={f.id} f={f} />)}</>;
}
