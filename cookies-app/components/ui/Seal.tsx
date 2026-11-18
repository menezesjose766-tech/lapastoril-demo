import { useId } from "react";
import { BRAND } from "@/data/config";

/** Sello circular de la marca (texto en círculo + monograma). */
export function Seal({ className, tone = "pink", spin = false }: { className?: string; tone?: "pink" | "choco" | "cream"; spin?: boolean }) {
  const id = "seal" + useId().replace(/:/g, "");
  const bg = tone === "pink" ? "#F2C6DE" : tone === "choco" ? "#3B1E14" : "#F5EDE6";
  const fg = tone === "choco" ? "#F2C6DE" : "#3B1E14";
  return (
    <svg viewBox="0 0 120 120" className={className} aria-label={BRAND.name}>
      <circle cx="60" cy="60" r="58" fill={bg} />
      <circle cx="60" cy="60" r="52" fill="none" stroke={fg} strokeWidth=".8" strokeDasharray="1.5 2.5" opacity=".6" />
      <defs><path id={id} d="M60 60m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" /></defs>
      <g style={spin ? { transformOrigin: "60px 60px", animation: "seal-spin 14s linear infinite" } : undefined}>
        <text fill={fg} fontSize="10.4" fontWeight="700" letterSpacing="2.2" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
          <textPath href={`#${id}`}>la chica de las cookies · {BRAND.city} ·</textPath>
        </text>
      </g>
      <text x="60" y="68" textAnchor="middle" fill={fg} fontSize="25" fontWeight="800" letterSpacing="-1.5" style={{ fontFamily: "var(--font-display)" }}>lc&amp;c</text>
      <style>{`@keyframes seal-spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-[family-name:var(--font-display)] font-extrabold tracking-[-0.06em] leading-[.85] ${className}`}>
      la chica <span className="text-[0.62em] font-bold tracking-[-0.03em] align-middle">de las</span> cookies
    </span>
  );
}

export function IgIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}
