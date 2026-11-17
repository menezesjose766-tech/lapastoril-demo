"use client";
import { useEffect } from "react";
import { initSpaRoute, useRoute } from "@/lib/route";
import HomeContent from "@/components/landing/HomeContent";
import Builder from "@/components/shop/Builder";
import Kitchen from "@/components/kitchen/Kitchen";

export default function SpaRoot() {
  const route = useRoute((s) => s.route);
  useEffect(() => {
    initSpaRoute();
    const on = () => initSpaRoute();
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  if (route === "/tienda") return <Builder />;
  if (route === "/cocina") return <Kitchen />;
  return <HomeContent />;
}
