/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "three", "recharts"],
  },
};

module.exports = nextConfig;
