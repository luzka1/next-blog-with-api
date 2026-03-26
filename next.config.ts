import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
        search: '',
      }
    ],
    dangerouslyAllowLocalIP: true,
  }
};

export default nextConfig;
