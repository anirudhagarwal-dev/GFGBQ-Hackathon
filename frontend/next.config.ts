import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL;
    return api
      ? [
          {
            source: "/api/:path*",
            destination: `${api}/:path*`,
          },
        ]
      : [];
  },
};

export default nextConfig;
