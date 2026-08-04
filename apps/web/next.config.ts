import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mosaic/ui", "@mosaic/core", "@mosaic/contracts"],
};

export default nextConfig;
