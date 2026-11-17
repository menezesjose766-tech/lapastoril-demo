import { ArrowRight } from "lucide-react";
export function Arrow({ className = "", tone = "bg-cream text-choco" }: { className?: string; tone?: string }) {
  return <span className={`inline-grid place-items-center w-9 h-9 rounded-full ${tone} transition-transform duration-300 group-hover:-rotate-45 ${className}`}><ArrowRight className="w-4 h-4" /></span>;
}
export const pill = "group inline-flex items-center gap-3 rounded-full font-semibold transition active:scale-95";
