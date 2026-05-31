import type { NextConfig } from "next";

// Backend FastAPI → Port 8087 (ভেতরে ভেতরে চলবে, বাইরে দেখা যাবে না)
const BACKEND_PORT = process.env.BACKEND_PORT || "8087";
const BACKEND_URL = process.env.BACKEND_URL || `http://127.0.0.1:${BACKEND_PORT}`;

const nextConfig: NextConfig = {
  // API calls একই subdomain থেকে FastAPI-তে forward হবে
  // ফলে মাত্র ১টা subdomain লাগবে: command.bondhumart.cloud
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },

  // PWA-র জন্য headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
