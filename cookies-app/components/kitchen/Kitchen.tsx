"use client";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ClipboardList, Flame, Plus, RotateCcw } from "lucide-react";
import { useOrders, type Status } from "@/store/orders";
import { useUI } from "@/store/ui";
import { OrderCard } from "./OrderCard";
import { BakeList } from "./BakeList";
import { TLink } from "@/components/ui/TLink";
import { Logo } from "@/components/ui/Seal";
import { money } from "@/data/config";

const COLS: { key: Status; title: string; badge: string }[] = [
  { key: "new", title: "Nuevos", badge: "bg-blush" },
  { key: "baking", title: "En el horno", badge: "bg-butter" },
  { key: "ready", title: "Listos", badge: "bg-mint" },
];

function useClock() {
  const [d, setD] = useState<Date | null>(null);
  useEffect(() => { setD(new Date()); const i = setInterval(() => setD(new Date()), 15000); return () => clearInterval(i); }, []);
  return d;
}

export default function Kitchen() {
  const orders = useOrders((s) => s.orders);
  const simulate = useOrders((s) => s.simulate);
  const reset = useOrders((s) => s.reset);
  const hydrated = useUI((s) => s.hydrated);
  const [view, setView] = useState<"board" | "bake">("board");
  const [fresh, setFresh] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const known = useRef<Set<string> | null>(null);
  const now = useClock();

  // detectar pedidos nuevos (de esta pestaña, de /tienda en otra pestaña o simulados)
  useEffect(() => {
    if (!hydrated) return;
    if (!known.current) { known.current = new Set(orders.map((o) => o.id)); return; }
    const added = orders.filter((o) => !known.current!.has(o.id));
    added.forEach((o) => known.current!.add(o.id));
    if (added.length) {
      setFresh((f) => [...f, ...added.map((o) => o.id)]);
      setToast(`Nuevo pedido de ${added[0].name} · ${added[0].items.length} cookies`);
      setTimeout(() => setFresh((f) => f.filter((id) => !added.some((a) => a.id === id))), 7000);
      setTimeout(() => setToast(null), 3200);
    }
  }, [orders, hydrated]);

  const today = new Date().toISOString().slice(0, 10);
  const visible = hydrated ? orders : [];
  const count = (s: Status) => visible.filter((o) => o.status === s).length;
  const sales = visible.filter((o) => new Date(o.createdAt).toISOString().slice(0, 10) === today).reduce((s, o) => s + o.total, 0);
  const delivered = visible.filter((o) => o.status === "done").length;

  const kpis = [
    { k: "Nuevos", v: count("new"), dot: "bg-blush-2" },
    { k: "En el horno", v: count("baking"), dot: "bg-butter" },
    { k: "Listos", v: count("ready"), dot: "bg-mint" },
  ];

  const navBtn = (v: "board" | "bake", Icon: typeof Flame, label: string) => (
    <button onClick={() => setView(v)} className={`relative w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${view === v ? "text-choco" : "text-cream/75 hover:text-cream hover:bg-cream/5"}`}>
      {view === v && <motion.span layoutId="knav" className="absolute inset-0 rounded-2xl bg-blush" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
      <Icon className="relative w-4 h-4" /><span className="relative">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_1fr] bg-cream">
      {/* Sidebar */}
      <aside className="hidden lg:flex sticky top-0 h-screen flex-col bg-choco text-cream p-5">
        <TLink href="/" className="text-[22px] text-blush px-2"><Logo /></TLink>
        <p className="mt-3 px-2 flex items-center gap-2 num text-[12px] uppercase tracking-[0.14em] text-cream/60">
          <span className="relative inline-flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" /><span className="relative w-2 h-2 rounded-full bg-emerald-400" /></span>
          Cocina en vivo
        </p>
        <nav className="mt-8 space-y-1">
          {navBtn("board", ClipboardList, "Pedidos")}
          {navBtn("bake", Flame, "Lista de horneado")}
        </nav>
        <button onClick={() => simulate()} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-cream/30 py-3 font-semibold hover:border-blush hover:text-blush active:scale-95 transition">
          <Plus className="w-4 h-4" /> Simular un pedido
        </button>
        <div className="mt-auto space-y-3">
          <div className="rounded-2xl bg-cream/5 p-4">
            <p className="num text-[36px] font-bold leading-none">{now ? now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--"}</p>
            <p className="text-[13px] text-cream/60 mt-1 first-letter:uppercase">{now?.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          <button onClick={reset} className="flex items-center gap-2 px-2 text-[13px] text-cream/50 hover:text-cream"><RotateCcw className="w-3.5 h-3.5" /> Reiniciar demo</button>
          <TLink href="/tienda" className="flex items-center gap-2 px-2 text-[13px] text-cream/70 hover:text-blush"><ArrowLeft className="w-3.5 h-3.5" /> Ir a la tienda</TLink>
        </div>
      </aside>

      <main className="min-w-0 px-3 md:px-6 lg:px-8 pb-10" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
        {/* Header móvil */}
        <div className="lg:hidden sticky top-0 z-30 -mx-3 md:-mx-6 px-3 md:px-6 pt-2 pb-3 bg-cream/90 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <TLink href="/" className="text-[18px]"><Logo /></TLink>
            <button onClick={() => simulate()} className="inline-flex items-center gap-1.5 rounded-full bg-choco text-cream px-4 py-2 text-[13px] font-semibold active:scale-95"><Plus className="w-4 h-4" /> Simular</button>
          </div>
          <div className="mt-3 grid grid-cols-2 p-1 rounded-full bg-choco/[.06]">
            {(["board", "bake"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={`relative rounded-full py-2 text-[14px] font-semibold ${view === v ? "text-cream" : ""}`}>
                {view === v && <motion.span layoutId="mtab" className="absolute inset-0 rounded-full bg-choco" />}
                <span className="relative">{v === "board" ? "Tablero" : "Horneado"}</span>
              </button>
            ))}
          </div>
        </div>

        <header className="hidden lg:flex items-end justify-between pt-6 pb-2">
          <div>
            <p className="num text-[12px] uppercase tracking-[0.16em] text-choco/55">Tablero de cocina</p>
            <h1 className="display text-[52px] mt-1">{view === "board" ? "Pedidos de hoy" : "Qué hornear"}</h1>
          </div>
          <p className="text-[14px] text-choco/60 max-w-[320px] text-right">Abrí la tienda en otra pestaña y hacé un pedido: aparece acá al instante.</p>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 mt-4">
          {kpis.map((k) => (
            <div key={k.k} className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-choco/65"><i className={`w-2.5 h-2.5 rounded-full ${k.dot}`} />{k.k}</p>
              <motion.p key={k.v} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="num text-[40px] md:text-[52px] font-bold leading-none mt-2">{k.v}</motion.p>
            </div>
          ))}
          <div className="bg-blush rounded-2xl md:rounded-3xl p-4 md:p-5">
            <p className="text-[13px] font-semibold text-choco/70">Ventas de hoy</p>
            <motion.p key={sales} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="num text-[30px] md:text-[40px] font-bold leading-none mt-3 tracking-tight">{money(sales)}</motion.p>
            <p className="num text-[12px] text-choco/60 mt-1">{delivered} entregados</p>
          </div>
        </section>

        <div className="mt-5 md:mt-6">
          <AnimatePresence mode="wait">
            {view === "board" ? (
              <motion.div key="board" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <LayoutGroup>
                  <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar -mx-3 px-3 md:mx-0 md:px-0">
                    {COLS.map((c) => {
                      const list = visible.filter((o) => o.status === c.key).sort((a, b) => b.createdAt - a.createdAt);
                      return (
                        <div key={c.key} className="snap-start shrink-0 w-[86vw] sm:w-[60vw] md:w-auto rounded-3xl bg-cream-2/70 p-3 md:p-4 min-h-[60vh]">
                          <div className="flex items-center justify-between px-1 mb-3">
                            <h2 className="font-bold text-[16px] flex items-center gap-2">{c.title}</h2>
                            <span className={`num text-[12px] font-bold rounded-full px-2.5 py-0.5 ${c.badge}`}>{list.length}</span>
                          </div>
                          <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                              {list.map((o) => <OrderCard key={o.id} o={o} fresh={fresh.includes(o.id)} />)}
                            </AnimatePresence>
                            {list.length === 0 && <p className="text-center text-[14px] text-choco/40 py-10">Nada por acá ✨</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </motion.div>
            ) : (
              <motion.div key="bake" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <BakeList orders={visible} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-choco text-cream pl-3 pr-5 py-2.5 shadow-2xl flex items-center gap-3 text-[14px] font-semibold whitespace-nowrap">
            <span className="w-7 h-7 rounded-full bg-blush grid place-items-center">🔔</span>{toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
