/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
