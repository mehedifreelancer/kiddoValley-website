import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ Use only remotePatterns (domains is deprecated)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tinyurl.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.tinyurl.com",
        port: "",
        pathname: "/**",
      },
      // Local backend (port 4000)
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      // 127.0.0.1 (alternative localhost)
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/uploads/**",
      },
      // ✅ Fixed: removed stray line and properly added the pattern
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
    ],
    // ✅ Ensure no `domains` array exists here
  },
};

export default nextConfig;
