"use client";
import { useEffect, useState } from "react";
import { usePath } from "@/lib/route";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { TLink } from "@/components/ui/TLink";
import { Logo } from "@/components/ui/Seal";
import { useCart } from "@/store/cart";
import { useOrders } from "@/store/orders";
import { useUI } from "@/store/ui";

function LiveDot() {
  return (
    <span className="relative inline-flex w-2 h-2">
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-70" />
      <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
    </span>
  );
}

export default function Navbar() {
  const pathname = usePath();
  const hydrated = useUI((s) => s.hydrated);
  const count = useCart((s) => s.items.length);
  const newOrders = useOrders((s) => s.orders.filter((o) => o.status === "new").length);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: "/tienda", label: "Tienda" },
    { href: "/#sabores", label: "Sabores" },
    { href: "/#promos", label: "Promos" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-cream/80 backdrop-blur-xl shadow-[0_1px_0_rgba(59,30,20,.08)]" : ""}`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="mx-auto max-w-[1440px] h-16 md:h-[72px] px-4 md:px-8 grid grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-1">
            <button className="md:hidden -ml-2 p-2 rounded-full hover:bg-choco/5" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu className="w-5 h-5" /></button>
            {links.map((l) => (
              <TLink key={l.href} href={l.href} className="hidden md:inline-flex px-3.5 py-2 rounded-full text-[15px] font-medium hover:bg-choco/5 transition">{l.label}</TLink>
            ))}
          </div>
          <TLink href="/" className="text-[16px] sm:text-[19px] md:text-[23px] text-center whitespace-nowrap" aria-label="Inicio"><Logo /></TLink>
          <div className="flex items-center justify-end gap-1.5">
            <TLink href="/cocina" className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[15px] font-medium hover:bg-choco/5 transition">
              <LiveDot /> Cocina
              {hydrated && newOrders > 0 && <span className="num text-[11px] font-bold bg-choco text-cream rounded-full px-1.5 py-0.5">{newOrders}</span>}
            </TLink>
            <TLink href="/tienda" className="inline-flex items-center gap-2 bg-choco text-cream rounded-full pl-1.5 sm:pl-4 pr-1.5 py-1.5 text-[14px] font-semibold whitespace-nowrap hover:scale-[1.03] active:scale-95 transition" aria-label="Tu caja">
              <span className="hidden sm:inline">Tu caja</span><ShoppingBag className="sm:hidden w-4 h-4 ml-1" />
              <motion.span key={count} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="num bg-blush text-choco rounded-full min-w-7 h-7 px-2 grid place-items-center text-[13px] font-bold">
                {hydrated ? count : 0}
              </motion.span>
            </TLink>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] bg-choco text-cream flex flex-col p-6" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}>
            <div className="flex justify-between items-center"><Logo className="text-xl" /><button onClick={() => setOpen(false)} className="p-2 rounded-full bg-cream/10" aria-label="Cerrar menú"><X className="w-5 h-5" /></button></div>
            <div className="mt-auto flex flex-col gap-2">
              {[...links, { href: "/cocina", label: "Cocina" }].map((l, i) => (
                <motion.div key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <TLink href={l.href} onClick={() => setOpen(false)} className="display text-[18vw] leading-[.95] block">{l.label}</TLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
