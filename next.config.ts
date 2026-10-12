import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    qualities: [85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: '',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: '',
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: '',
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
