import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'],
    // Use Netlify's image optimization capabilities
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    // Enable optimization in all environments
    unoptimized: false
  }
};

export default nextConfig;
