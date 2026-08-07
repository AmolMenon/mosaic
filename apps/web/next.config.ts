import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mosaic/ui", "@mosaic/core", "@mosaic/contracts"],
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
