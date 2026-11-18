import HomeContent from "@/components/landing/HomeContent";
import SpaRoot from "@/components/SpaRoot";
import { SPA } from "@/lib/route";

export default function Home() {
  return SPA ? <SpaRoot /> : <HomeContent />;
}
