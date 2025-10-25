import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Enable React compiler for better performance
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-tabs"],
  },

  // Output standalone for faster deployment
  output: "standalone",
}

export default nextConfig
