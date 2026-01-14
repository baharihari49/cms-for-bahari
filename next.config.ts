import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // MinIO storage
      {
        protocol: 'https',
        hostname: 'storage.baharihari.com',
        pathname: '/**',
      },
      // Keep Cloudinary for existing/legacy images
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
