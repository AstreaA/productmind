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
  output: 'export'
};

export default nextConfig;
