/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "harmless-cod-256.convex.cloud"
      },
      {
        protocol: 'https',
        hostname: "https://rosy-penguin-224.convex.cloud"
      }
    ],
  },

};

export default nextConfig;
