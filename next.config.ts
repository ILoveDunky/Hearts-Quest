
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Enables static export
  basePath: '/Hearts-Quest',
  images: {
    unoptimized: true, // Required for static export
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
