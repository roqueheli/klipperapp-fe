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
    'https://klipperapp-be.onrender.com'
  ]
};

export default nextConfig;
