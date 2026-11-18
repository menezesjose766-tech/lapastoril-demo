"use client";
import Link from "next/link";
import { SPA, usePath } from "@/lib/route";
import { useUI } from "@/store/ui";

/** Link que dispara la transición de "caja plegable" antes de navegar. */
export function TLink({ href, children, className, onClick, ...rest }: React.ComponentProps<typeof Link> & { href: string }) {
  const pathname = usePath();
  const Comp = (SPA ? "a" : Link) as typeof Link;
  const spaHref = SPA ? (href.startsWith("/#") ? "#" : href === "/" ? "#" : "#" + href.slice(1)) : href;
  return (
    <Comp
      href={spaHref}
      className={className}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
        const [path, hash] = href.split("#");
        if ((path || "/") === pathname) {
          if (hash) { e.preventDefault(); document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }); }
          return;
        }
        e.preventDefault();
        if (useUI.getState().phase === "idle") useUI.getState().setPhase("closing", href);
      }}
    >
      {children}
    </Comp>
  );
}

export function useGo() {
  return (href: string) => { if (useUI.getState().phase === "idle") useUI.getState().setPhase("closing", href); };
}
