/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Standalone output для Docker - критически важно для TimeWeb Cloud
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
    ],
  },
  
  // Оптимизация для production
  swcMinify: true,
  
  // Компрессия
  compress: true,
  
  // Для правильной работы CSS
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
