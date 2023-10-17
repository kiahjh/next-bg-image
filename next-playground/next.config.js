/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [`@friends-library/next-bg-image`],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
