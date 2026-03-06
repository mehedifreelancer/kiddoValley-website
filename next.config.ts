import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        pathname: "/**", // This allows any path under this hostname
      },
      {
        protocol: "https",
        hostname: "tinyurl.com",
        port: "",
        pathname: "/**", // This allows any path under this hostname
      },
      {
        protocol: "https",
        hostname: "*.tinyurl.com", // Also allow subdomains if needed
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
