import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.lemoustache.cl", 'instagram.fscl9-1.fna.fbcdn.net', "instagram.fscl9-2.fna.fbcdn.net"],
  },
  allowedDevOrigins: [
    'https://771a-2800-300-66d1-af70-f461-1f4f-a97d-2321.ngrok-free.app'
  ]
};

export default nextConfig;
