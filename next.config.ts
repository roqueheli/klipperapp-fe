import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dfrphh35s/image/upload/**", // Include your specific Cloudinary path
      },
    ],
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https://res.cloudinary.com",
              "media-src 'self' https://res.cloudinary.com",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self'",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-src 'none'",
              "object-src 'none'"
            ].join("; ")
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          }
        ],
      },
    ];
  },
};

export default nextConfig;
