import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["cataas.com", "api.made.quixoria.ru"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Разрешает все хостнеймы
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
