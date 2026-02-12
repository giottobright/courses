/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Standalone output для Docker - критически важно для TimeWeb Cloud
  output: 'standalone',
  
  // Явное указание публичных переменных окружения
  // Важно для Timeweb Cloud - гарантирует доступность в браузере
  env: {
    NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_ADMIN_USER_IDS: process.env.NEXT_PUBLIC_ADMIN_USER_IDS,
  },
  
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
