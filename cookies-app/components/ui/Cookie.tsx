import { memo, useId } from "react";
import { FLAVOURS, flavourById, type Flavour } from "@/data/flavours";
import { rng } from "@/lib/hash";

/** Defs compartidas (una sola vez en el layout). */
export function CookieDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="ck-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.55" /></feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="ck-bump" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="8" result="t" />
          <feDiffuseLighting in="t" surfaceScale="3.2" lightingColor="#fff" result="l">
            <feDistantLight azimuth="225" elevation="48" />
          </feDiffuseLighting>
          <feComposite in="l" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="ck-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id="ck-shine" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".28" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </radialGradient>
        <linearGradient id="ck-marsh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B86A2E" />
          <stop offset=".45" stopColor="#E9B57A" />
          <stop offset="1" stopColor="#FFF7EC" />
        </linearGradient>
        {FLAVOURS.map((f) => (
          <radialGradient key={f.id} id={`ck-dough-${f.id}`} cx="45%" cy="42%" r="62%">
            <stop offset="0" stopColor={f.dough} />
            <stop offset=".72" stopColor={f.dough} />
            <stop offset="1" stopColor={f.doughDark} />
          </radialGradient>
        ))}
      </defs>
    </svg>
  );
}

function blob(r: () => number, cx: number, cy: number, rad: number, n: number, jitter: number) {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = rad * (1 - jitter / 2 + r() * jitter);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    d += i === 0 ? `M${((pts[n - 1][0] + p[0]) / 2).toFixed(1)} ${((pts[n - 1][1] + p[1]) / 2).toFixed(1)}` : "";
    d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return d + "Z";
}

const HEART = "M0 3.2C-1 1.6-4.6 0-4.6-2.4c0-1.6 1.2-2.8 2.6-2.8 1 0 1.6.6 2 1.2.4-.6 1-1.2 2-1.2 1.4 0 2.6 1.2 2.6 2.8C4.6 0 1 1.6 0 3.2Z";

function CookieInner({ f, seed, clip }: { f: Flavour; seed: string; clip: string }) {
  const r = rng(f.id + seed);
  const outline = blob(r, 100, 100, 82, 26, 0.09);
  const inside = (min: number, max: number) => {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (max - min) + min;
    return [100 + Math.cos(a) * d, 100 + Math.sin(a) * d] as const;
  };
  // grietas / pliegues de masa
  const cracks = Array.from({ length: 7 }, () => {
    const [x, y] = inside(10, 62), a = r() * Math.PI, l = 10 + r() * 16;
    return `M${(x - Math.cos(a) * l).toFixed(1)} ${(y - Math.sin(a) * l).toFixed(1)} q${(r() * 10 - 5).toFixed(1)} ${(r() * 10 - 5).toFixed(1)} ${(Math.cos(a) * l * 2).toFixed(1)} ${(Math.sin(a) * l * 2).toFixed(1)}`;
  });
  const chunks = Array.from({ length: f.topping === "cookie" ? 9 : 12 }, (_, i) => {
    const [x, y] = inside(0, 66), s = 7 + r() * 9;
    return { d: blob(r, x, y, s, 6, 0.7), c: f.topping === "cookie" ? f.chunks[0] : f.chunks[i % f.chunks.length], x, y, s };
  });
  const drizzle = (color: string, rot: number, w: number, lines = 6) => {
    const ds: string[] = [];
    for (let k = 0; k < lines; k++) {
      const y = 40 + (k / (lines - 1)) * 120 + (r() * 8 - 4);
      const amp = 4 + r() * 5, ph = r() * 6, fr = 0.05 + r() * 0.03;
      let d = "";
      for (let x = 10; x <= 190; x += 6) d += `${x === 10 ? "M" : "L"}${x} ${(y + Math.sin(x * fr + ph) * amp).toFixed(1)} `;
      ds.push(d);
    }
    return (
      <g clipPath={`url(#${clip})`} transform={`rotate(${rot} 100 100)`}>
        <g fill="none" stroke="#000" strokeOpacity=".18" strokeWidth={w} strokeLinecap="round" transform="translate(1 1.6)">{ds.map((d, i) => <path key={i} d={d} />)}</g>
        <g fill="none" stroke={color} strokeWidth={w} strokeLinecap="round">{ds.map((d, i) => <path key={i} d={d} />)}</g>
      </g>
    );
  };
  return (
    <>
      <ellipse cx="104" cy="112" rx="84" ry="80" fill="#3B1E14" opacity=".28" filter="url(#ck-shadow)" />
      <defs><clipPath id={clip}><circle cx="100" cy="100" r="70" /></clipPath></defs>
      <path d={outline} fill={f.doughDark} transform="translate(0 4)" />
      <path d={outline} fill={`url(#ck-dough-${f.id})`} />
      <path d={outline} fill="#000" opacity=".35" filter="url(#ck-bump)" style={{ mixBlendMode: "soft-light" }} />
      <g stroke={f.doughDark} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity=".45">
        {cracks.map((d, i) => <path key={i} d={d} />)}
      </g>
      {f.topping === "caramel" && <path d={blob(r, 100, 98, 30, 10, 0.4)} fill="#B7692B" opacity=".9" />}
      {chunks.map((c, i) =>
        f.topping === "cookie" && i % 2 === 0 ? (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r={c.s * 1.25} fill="#141010" />
            <circle cx={c.x} cy={c.y} r={c.s * 0.8} fill="none" stroke="#2B2320" strokeWidth="1.2" strokeDasharray="2 2" />
          </g>
        ) : (
          <g key={i}>
            <path d={c.d} fill={c.c} />
            <path d={c.d} fill="#fff" opacity=".18" transform={`translate(-1.2 -1.4)`} style={{ mixBlendMode: "overlay" }} />
          </g>
        )
      )}
      {f.topping === "berries" &&
        Array.from({ length: 5 }, (_, i) => {
          const [x, y] = inside(8, 58);
          return (
            <g key={"b" + i} transform={`translate(${x} ${y})`}>
              <circle r="9.5" fill="#B0123F" />
              <circle r="9.5" fill="url(#ck-shine)" />
              {Array.from({ length: 6 }, (_, k) => <circle key={k} cx={Math.cos(k) * 5} cy={Math.sin(k * 1.3) * 5} r="1.1" fill="#FF7FA0" />)}
            </g>
          );
        })}
      {f.topping === "marshmallow" &&
        Array.from({ length: 6 }, (_, i) => {
          const [x, y] = inside(4, 56);
          return <rect key={"m" + i} x={x - 9} y={y - 9} width="18" height="18" rx="6" fill="url(#ck-marsh)" transform={`rotate(${r() * 90} ${x} ${y})`} />;
        })}
      {f.drizzle && drizzle(f.drizzle, r() * 50 - 25, 3.2)}
      {f.id === "frambuesa" && drizzle("#F2A7C3", 75, 2.2, 4)}
      {f.topping === "hearts" &&
        [[-14, -8, 2.3], [26, 22, 1.6], [-30, 30, 1.3]].map(([dx, dy, s], i) => (
          <g key={"h" + i} transform={`translate(${100 + dx} ${100 + dy}) scale(${s * 2.2}) rotate(${i * 18 - 12})`}>
            <path d={HEART} fill={i === 1 ? "#FFF6EC" : f.id === "choco-rosa" ? "#FFF6EC" : "#F48FB1"} />
            <path d={HEART} fill="url(#ck-shine)" />
          </g>
        ))}
      {f.topping === "caramel" && drizzle("#8A4718", 40, 2.6, 4)}
      <path d={outline} fill="url(#ck-shine)" />
      <path d={outline} fill="#fff" opacity=".22" filter="url(#ck-grain)" style={{ mixBlendMode: "overlay" }} />
    </>
  );
}

export const Cookie = memo(function Cookie({ id, seed = "a", className, style }: { id: string; seed?: string; className?: string; style?: React.CSSProperties }) {
  const f = flavourById(id);
  const clip = "ckc" + useId().replace(/:/g, "");
  if (f.photo)
    return (
      <svg viewBox="0 0 200 200" className={className} style={style} role="img" aria-label={`Cookie ${f.name}`}>
        <ellipse cx="104" cy="112" rx="82" ry="78" fill="#3B1E14" opacity=".3" filter="url(#ck-shadow)" />
        <image href={f.photo} x="4" y="4" width="192" height="192" preserveAspectRatio="xMidYMid meet" />
      </svg>
    );
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} role="img" aria-label={`Cookie ${f.name}`}>
      <CookieInner f={f} seed={seed} clip={clip} />
    </svg>
  );
});
