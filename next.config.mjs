/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "harmless-cod-256.convex.cloud"
      }
    ],
  },

};

export default nextConfig;
