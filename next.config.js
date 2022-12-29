/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      beforeFiles: [{ source: "/:path*", destination: "/api/:path*" }],
    };
  },
};

module.exports = nextConfig;
