import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mosaic/ui", "@mosaic/core", "@mosaic/contracts"],
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
