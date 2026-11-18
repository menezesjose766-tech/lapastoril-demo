import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CookieDefs } from "@/components/ui/Cookie";
import StoreSync from "@/components/StoreSync";
import Chrome from "@/components/Chrome";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-jakarta" });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  title: "la chica de las cookies · Tandil",
  description: "Cookies gigantes y rellenas, horneadas a pedido en Tandil. Armá tu caja online.",
};
export const viewport: Viewport = { themeColor: "#F2C6DE", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${jakarta.variable} ${dm.variable} ${grotesk.variable}`}>
      <body>
        <CookieDefs />
        <StoreSync />
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
