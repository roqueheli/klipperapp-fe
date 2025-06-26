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
  },
  async headers() {
    const isProduction = process.env.NODE_ENV === 'production';

    return [
      {
        // Aplica estas cabeceras a todas las rutas
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              img-src 'self' data: blob: https://res.cloudinary.com https://*.herokuapp.com https://instagram.fscl38-1.fna.fbcdn.net https://instagram.fscl9-1.fna.fbcdn.net https://instagram.fscl9-2.fna.fbcdn.net;
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              font-src 'self';
              connect-src 'self' https://res.cloudinary.com https://*.herokuapp.com;
              media-src 'self' https://res.cloudinary.com;
              frame-src 'none';
              object-src 'none';
              base-uri 'self';
              form-action 'self'
            `.replace(/\n/g, ' ').trim()
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
  }
};

export default nextConfig;