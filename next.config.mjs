/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
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
  
  // Важно: убедимся что статика правильно обслуживается
  assetPrefix: undefined,
  
  // Для правильной работы CSS
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
