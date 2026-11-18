import { Cookie } from "@/components/ui/Cookie";
import { Seal } from "@/components/ui/Seal";
import { flavourById } from "@/data/flavours";

/** Pila de cookies gruesas vistas en perspectiva. */
export function CookieStack({ ids, className = "" }: { ids: string[]; className?: string }) {
  return (
    <div className={`relative aspect-[1/1.15] ${className}`}>
      {ids.map((id, i) => {
        const f = flavourById(id);
        return (
          <div key={i} className="absolute inset-x-0" style={{ bottom: `${i * 15}%`, zIndex: i }}>
            <div className="relative" style={{ transform: `rotate(${(i % 2 ? 1 : -1) * (3 + i)}deg) translateX(${(i % 2 ? 1 : -1) * 3}%)` }}>
              {/* espesor */}
              <div className="absolute inset-0 rounded-[50%]" style={{ background: `linear-gradient(${f.doughDark}, ${f.doughDark} 60%, #2a140c)`, transform: "scaleY(.42) translateY(17%)", filter: "drop-shadow(0 18px 18px rgba(59,30,20,.35))" }} />
              <Cookie id={id} seed={"stack" + i} className="relative w-full block" style={{ transform: "scaleY(.42)", transformOrigin: "center" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Caja abierta con cookies adentro y tapa con sello. */
export function OpenBox({ ids, cols = 3, className = "" }: { ids: string[]; cols?: number; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ perspective: 1200 }}>
      {/* tapa */}
      <div className="absolute inset-x-[6%] bottom-[74%] h-[40%] rounded-[22px] bg-[#4A281B] origin-bottom grid place-items-center" style={{ transform: "rotateX(-14deg)", boxShadow: "inset 0 0 0 6px #3B1E14, inset 0 -40px 50px -20px rgba(0,0,0,.45)" }}>
        <Seal className="w-[24%] -rotate-12 -mt-[4%]" />
      </div>
      {/* base */}
      <div className="relative rounded-[22px] bg-choco p-[4%] shadow-[0_40px_60px_-25px_rgba(59,30,20,.7)]" style={{ transform: "rotateX(28deg)", transformOrigin: "bottom" }}>
        <div className="rounded-[14px] bg-[#F7EFE8] p-[3%] grid gap-[3%]" style={{ gridTemplateColumns: `repeat(${cols},1fr)`, boxShadow: "inset 0 10px 20px rgba(59,30,20,.25)" }}>
          {ids.map((id, i) => <Cookie key={i} id={id} seed={"box" + i} className="w-full" />)}
        </div>
      </div>
    </div>
  );
}

/** Caja cerrada (vista 3/4) con sello. */
export function ClosedBox({ size, className = "" }: { size: 4 | 6 | 12; className?: string }) {
  const w = size === 4 ? 0.6 : size === 6 ? 0.72 : 0.84;
  return (
    <div className={`relative ${className}`} style={{ perspective: 900 }}>
      <div className="mx-auto" style={{ width: `${w * 100}%`, transform: "rotateX(52deg) rotateZ(-8deg)", transformStyle: "preserve-3d" }}>
        <div className="relative aspect-[1.35] rounded-[18px] bg-choco grid place-items-center shadow-[0_50px_50px_-20px_rgba(59,30,20,.55)]" style={{ boxShadow: "inset 0 -10px 0 #2A140C, 0 50px 50px -20px rgba(59,30,20,.55)" }}>
          <div className="absolute inset-y-0 left-1/2 w-[9%] -translate-x-1/2 bg-blush/90" />
          <Seal className="relative w-[34%]" />
        </div>
      </div>
    </div>
  );
}
