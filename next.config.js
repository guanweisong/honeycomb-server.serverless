/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    LINK_OBJECT_ID: '5349b4ddd2781d08c09890f3',
    FRONT_DOMAIN: 'www.guanweisong.com',
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@react-email/components',
      '@react-email/render',
      '@react-email/html',
    ],
  },
  transpilePackages: ['@react-email/components', '@react-email/render', '@react-email/html'],
};

module.exports = nextConfig;
