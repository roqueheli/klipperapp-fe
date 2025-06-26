import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'herokuapp.com',
      },
      {
        protocol: 'https',
        hostname: 'instagram.fscl38-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'instagram.fscl9-1.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'instagram.fscl9-2.fna.fbcdn.net',
      },
    ],
  }
};

export default nextConfig;
