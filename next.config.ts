import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.lemoustache.cl", 'instagram.fscl9-1.fna.fbcdn.net', "instagram.fscl9-2.fna.fbcdn.net"],
  },
  allowedDevOrigins: [
    'https://klipperapp-be.onrender.com'
  ]
};

export default nextConfig;
