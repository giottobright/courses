/** @type {import('next').NextConfig} */
const nextConfig = {
  // ВАЖНО: для деплоя на production серверах
  output: 'standalone',
  
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
  
  // Опционально: если используете custom server или прокси
  // experimental: {
  //   outputStandalone: true,
  // },
};

export default nextConfig;
