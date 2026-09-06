import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ ডেভেলপমেন্টে local backend (localhost:4000) থেকে ইমেজ ফেচ করার জন্য
    // Next.js এর SSRF protection override করতে হবে
    dangerouslyAllowLocalIP: true,

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
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/uploads/**",
      },
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
  },
};

export default nextConfig;
