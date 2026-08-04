import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mosaic/ui", "@mosaic/core", "@mosaic/contracts"],
  output: "standalone",
};

export default nextConfig;
