"use client";
import { TLink } from "@/components/ui/TLink";
import { Arrow, pill } from "@/components/ui/Button";
import { BRAND } from "@/data/config";
import { IgIcon } from "@/components/ui/Seal";

export default function Footer() {
  return (
    <footer className="bg-choco text-cream overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 pt-20 md:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-8 pb-16 border-b border-cream/15">
          <h2 className="display text-[clamp(64px,10vw,170px)]">¿Ya tenés<br /><span className="text-blush">hambre?</span></h2>
          <TLink href="/tienda" className={`${pill} bg-blush text-choco pl-7 pr-2 py-2 text-[18px] mb-4`}>Armá una caja <Arrow tone="bg-choco text-cream" /></TLink>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-[15px]">
          <div><p className="num text-[12px] uppercase tracking-[0.14em] text-cream/50 mb-3">Seguinos</p>
            <a className="flex items-center gap-2 hover:text-blush" href={BRAND.instagramUrl} target="_blank" rel="noreferrer"><IgIcon /> Instagram</a>
            <a className="block mt-2 hover:text-blush" href={BRAND.tiktokUrl} target="_blank" rel="noreferrer">TikTok</a></div>
          <div><p className="num text-[12px] uppercase tracking-[0.14em] text-cream/50 mb-3">Pedidos</p>
            <TLink className="block hover:text-blush" href="/tienda">Armá una caja</TLink>
            <TLink className="block mt-2 hover:text-blush" href="/cocina">Tablero de cocina</TLink></div>
          <div><p className="num text-[12px] uppercase tracking-[0.14em] text-cream/50 mb-3">Horarios</p><p>{BRAND.hours}</p><p className="mt-2">Pedidos hasta las 18 hs</p></div>
          <div><p className="num text-[12px] uppercase tracking-[0.14em] text-cream/50 mb-3">Dónde</p><p>{BRAND.city}, Buenos Aires</p><p className="mt-2 text-cream/60">Diseño y web: [Tu marca]</p></div>
        </div>
      </div>
      <div className="display text-blush/90 whitespace-nowrap text-[10.6vw] leading-[.8] tracking-[-0.07em] text-center translate-y-[12%] select-none" aria-hidden>la chica de las cookies</div>
    </footer>
  );
}
