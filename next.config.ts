import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output keeps the docker image small.
  output: "standalone",
  // Lucide icons are imported dynamically by name — let Next tree-shake them.
  experimental: {
    optimizePackageImports: ["lucide-react", "shiki"],
  },
  // No external images needed for MVP; keep this strict to surface mistakes.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
