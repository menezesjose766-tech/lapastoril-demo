import type { NextConfig } from "next";

const spa = process.env.NEXT_PUBLIC_SPA === "1";

const nextConfig: NextConfig = spa
  ? { output: "export", distDir: ".next-spa", images: { unoptimized: true }, devIndicators: false }
  : { devIndicators: false };

export default nextConfig;
