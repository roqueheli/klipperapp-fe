import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    domains: ["www.lemoustache.cl", 'instagram.fscl9-1.fna.fbcdn.net', "instagram.fscl9-2.fna.fbcdn.net"],
  },
  allowedDevOrigins: [
    'https://771a-2800-300-66d1-af70-f461-1f4f-a97d-2321.ngrok-free.app'
  ]
};

export default nextConfig;
