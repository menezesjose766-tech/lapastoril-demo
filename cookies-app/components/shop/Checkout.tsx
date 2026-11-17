"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bike, Check, Store, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { useOrders, makeOrder, type Order } from "@/store/orders";
import { useUI } from "@/store/ui";
import { BOXES, BRAND, DELIVERY_FEE, SLOTS, money } from "@/data/config";
import { flavourById } from "@/data/flavours";
import { Cookie } from "@/components/ui/Cookie";
import { useGo } from "@/components/ui/TLink";

const WD = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function nextDays() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { iso: d.toISOString().slice(0, 10), day: d.getDate(), label: i === 0 ? "Hoy" : i === 1 ? "Mañana" : WD[d.getDay()] };
  });
}

export default function Checkout() {
  const open = useUI((s) => s.checkoutOpen);
  const setOpen = useUI((s) => s.setCheckout);
  const { size, items, clear } = useCart();
  const addOrder = useOrders((s) => s.add);
  const nextNum = useOrders((s) => s.nextNum);
  const go = useGo();
  const days = useMemo(nextDays, [open]);

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<Order | null>(null);

  const total = BOXES[size].price + (mode === "delivery" ? DELIVERY_FEE : 0);
  const grouped = Object.entries(items.reduce<Record<string, number>>((a, id) => ((a[id] = (a[id] || 0) + 1), a), {}));
  const canNext = step === 1 ? !!slot : step === 2 ? name.trim().length > 1 && contact.trim().length > 2 : true;

  const move = (d: number) => { setDir(d); setStep((s) => s + d); };
  const close = () => {
    setOpen(false);
    setTimeout(() => { setStep(1); setDone(null); }, 400);
  };
  const submit = () => {
    const o = makeOrder({ name: name.trim(), contact: contact.trim(), note: note.trim(), mode, day: days[day].iso, dayLabel: `${days[day].label} ${days[day].day}`, slot: slot!, size, items, num: nextNum() });
    addOrder(o);
    clear();
    setDone(o);
  };

  const label = "num text-[12px] uppercase tracking-[0.14em] text-choco/55";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[75] flex items-end md:items-center justify-center md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-choco/50 backdrop-blur-sm" onClick={close} />
          <motion.div
            role="dialog" aria-modal="true" aria-label="Checkout"
            className="relative w-full md:max-w-[560px] max-h-[92dvh] overflow-y-auto no-scrollbar bg-white rounded-t-[32px] md:rounded-[32px] shadow-2xl"
            initial={{ y: 80, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 80, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 32 }}
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-6 pt-5 pb-4">
              <div className="flex items-center justify-between">
                {step > 1 && !done ? (
                  <button onClick={() => move(-1)} className="w-10 h-10 rounded-full bg-cream grid place-items-center" aria-label="Volver"><ArrowLeft className="w-4 h-4" /></button>
                ) : <span className="w-10" />}
                <span className="num text-[13px] font-medium">{done ? "¡Listo!" : `Paso ${step} de 3`}</span>
                <button onClick={close} className="w-10 h-10 rounded-full bg-cream grid place-items-center" aria-label="Cerrar"><X className="w-4 h-4" /></button>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-cream overflow-hidden"><motion.div className="h-full bg-choco rounded-full" animate={{ width: done ? "100%" : `${(step / 3) * 100}%` }} transition={{ type: "spring", stiffness: 200, damping: 30 }} /></div>
            </div>

            <div className="px-6 pb-6 overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                {done ? (
                  <Ticket key="done" o={done} onKitchen={() => { close(); go("/cocina"); }} onAgain={close} />
                ) : (
                  <motion.div key={step} custom={dir} initial={{ x: dir * 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: dir * -60, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    {step === 1 && (
                      <div className="space-y-6">
                        <h2 className="display text-[40px]">¿Cómo la querés?</h2>
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-cream">
                          {([["pickup", "Retiro", "Gratis", Store], ["delivery", "Envío", money(DELIVERY_FEE), Bike]] as const).map(([k, t, p, Icon]) => (
                            <button key={k} onClick={() => setMode(k)} className={`relative rounded-xl p-4 text-left transition ${mode === k ? "text-cream" : ""}`}>
                              {mode === k && <motion.span layoutId="mode" className="absolute inset-0 rounded-xl bg-choco" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
                              <span className="relative flex items-center gap-2 font-bold"><Icon className="w-4 h-4" /> {t}</span>
                              <span className={`relative num text-[13px] ${mode === k ? "text-blush" : "text-choco/55"}`}>{p}</span>
                            </button>
                          ))}
                        </div>
                        <div>
                          <p className={label}>Día</p>
                          <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
                            {days.map((d, i) => (
                              <button key={d.iso} onClick={() => setDay(i)} className={`shrink-0 w-[74px] rounded-2xl py-3 border-2 transition ${day === i ? "bg-blush border-choco" : "border-cream bg-cream/60 hover:border-choco/30"}`}>
                                <span className="block num text-[26px] font-bold leading-none">{String(d.day).padStart(2, "0")}</span>
                                <span className="block text-[12px] mt-1 font-medium">{d.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className={label}>Horario</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {SLOTS.map((s) => (
                              <button key={s} onClick={() => setSlot(s)} className={`rounded-full py-3 num text-[14px] font-medium border-2 transition ${slot === s ? "bg-choco text-cream border-choco" : "border-cream bg-cream/60 hover:border-choco/30"}`}>{s}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-5">
                        <h2 className="display text-[40px]">¿Para quién es?</h2>
                        <p className="text-choco/65 -mt-2">Sin cuentas ni contraseñas. Solo para saber a quién avisarle.</p>
                        <label className="block"><span className={label}>Nombre</span>
                          <input id="ck-name" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Sofi" className="mt-2 w-full rounded-2xl bg-cream px-5 py-4 text-[17px] outline-none focus:ring-2 ring-choco" /></label>
                        <label className="block"><span className={label}>Instagram o celular</span>
                          <input id="ck-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="@sofi.tandil o 2494 123456" className="mt-2 w-full rounded-2xl bg-cream px-5 py-4 text-[17px] outline-none focus:ring-2 ring-choco" /></label>
                        <label className="block"><span className={label}>Nota para la cocina (opcional)</span>
                          <textarea id="ck-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Es para un cumple, o una es para regalo…" className="mt-2 w-full rounded-2xl bg-cream px-5 py-4 text-[16px] outline-none focus:ring-2 ring-choco resize-none" /></label>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="space-y-5">
                        <h2 className="display text-[40px]">Revisá tu caja</h2>
                        <div className="rounded-2xl bg-cream p-4 space-y-3">
                          {grouped.map(([id, c]) => (
                            <div key={id} className="flex items-center gap-3">
                              <Cookie id={id} seed="sum" className="w-11 h-11" />
                              <span className="flex-1 font-semibold">{flavourById(id).name}</span>
                              <span className="num font-bold">×{c}</span>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[14px]">
                          <div className="rounded-2xl border border-cream p-3"><p className={label}>Entrega</p><p className="font-semibold mt-1">{mode === "pickup" ? "Retiro" : "Envío a domicilio"}</p></div>
                          <div className="rounded-2xl border border-cream p-3"><p className={label}>Cuándo</p><p className="font-semibold mt-1">{days[day].label} {days[day].day} · {slot}</p></div>
                        </div>
                        <div className="space-y-1.5 num text-[15px]">
                          <div className="flex justify-between"><span>{BOXES[size].name} × {size}</span><span>{money(BOXES[size].price)}</span></div>
                          <div className="flex justify-between"><span>{mode === "delivery" ? "Envío" : "Retiro"}</span><span>{mode === "delivery" ? money(DELIVERY_FEE) : "Gratis"}</span></div>
                          <div className="flex justify-between text-[22px] font-bold pt-2 border-t border-cream"><span>Total</span><span>{money(total)}</span></div>
                        </div>
                        <p className="text-[13px] text-choco/60 bg-cream/60 rounded-xl p-3">El pago se hace por DM una vez que confirmamos el día. En esta web no se cobra nada.</p>
                      </div>
                    )}
                    <div className="mt-7">
                      {step < 3 ? (
                        <button disabled={!canNext} onClick={() => move(1)} className="group w-full inline-flex items-center justify-between rounded-full bg-choco text-cream pl-6 pr-1.5 py-1.5 font-bold text-[16px] disabled:opacity-35 transition">
                          Siguiente <span className="w-10 h-10 rounded-full bg-blush text-choco grid place-items-center group-enabled:group-hover:-rotate-45 transition-transform"><ArrowRight className="w-4 h-4" /></span>
                        </button>
                      ) : (
                        <button onClick={submit} className="w-full rounded-full bg-blush text-choco py-4 font-bold text-[17px] hover:bg-blush-2 active:scale-[.98] transition">Enviar a la cocina 🍪</button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Ticket({ o, onKitchen, onAgain }: { o: Order; onKitchen: () => void; onAgain: () => void }) {
  const msg = encodeURIComponent(`¡Hola! Hice el pedido #${o.code} 🍪 (${o.size} cookies, ${o.dayLabel}, ${o.slot}). Soy ${o.name}.`);
  return (
    <motion.div initial={{ y: 40, opacity: 0, rotate: -2 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="pt-2">
      <div className="flex items-center gap-3">
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-12 h-12 rounded-full bg-mint grid place-items-center"><Check className="w-6 h-6" /></motion.span>
        <h2 className="display text-[36px]">¡Ya está en la cocina!</h2>
      </div>
      <div className="relative mt-6 rounded-3xl bg-cream p-6" style={{ WebkitMask: "radial-gradient(circle 12px at 0 62%, transparent 98%, #000) , radial-gradient(circle 12px at 100% 62%, transparent 98%, #000)", WebkitMaskComposite: "source-in", maskComposite: "intersect" }}>
        <p className="num text-[12px] uppercase tracking-[0.16em] text-choco/55">Tu código</p>
        <p className="num text-[44px] font-bold tracking-tight leading-none mt-1">#{o.code}</p>
        <div className="flex -space-x-3 mt-5">{o.items.map((id, i) => <Cookie key={i} id={id} seed={"tk" + i} className="w-10 h-10" />)}</div>
        <div className="my-5 border-t-2 border-dashed border-choco/15" />
        <div className="grid grid-cols-2 gap-3 text-[14px]">
          <div><p className="text-choco/55 text-[12px]">Para</p><p className="font-semibold">{o.name}</p></div>
          <div><p className="text-choco/55 text-[12px]">Cuándo</p><p className="font-semibold">{o.dayLabel} · {o.slot}</p></div>
          <div><p className="text-choco/55 text-[12px]">Entrega</p><p className="font-semibold">{o.mode === "pickup" ? "Retiro" : "Envío"}</p></div>
          <div><p className="text-choco/55 text-[12px]">Total</p><p className="font-semibold num">{money(o.total)}</p></div>
        </div>
      </div>
      <p className="text-[13px] text-choco/60 mt-4">Te escribimos a <b>{o.contact}</b> para confirmar el día y coordinar el pago.</p>
      <div className="mt-5 grid gap-2">
        <button onClick={onKitchen} className="w-full rounded-full bg-choco text-cream py-4 font-bold">Verlo en el tablero de cocina →</button>
        {BRAND.whatsapp && <a href={`https://wa.me/${BRAND.whatsapp}?text=${msg}`} target="_blank" rel="noreferrer" className="w-full text-center rounded-full bg-[#25D366] text-white py-4 font-bold">Avisar por WhatsApp</a>}
        <button onClick={onAgain} className="w-full rounded-full py-3 font-semibold text-choco/70 hover:text-choco">Armar otra caja</button>
      </div>
    </motion.div>
  );
}
