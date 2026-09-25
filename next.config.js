/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  allowedDevOrigins: ["*.replit.dev", "*.pike.replit.dev", "*"],
  async rewrites() {
    return [
      {
        source: "/sitemap/:state(\\w+(?:-\\d+)?)\\.xml",
        destination: "/sitemap/:state",
      },
      {
        source: "/:state([a-z]{2}(?:-\\d+)?)\\.xml",
        destination: "/sitemap/:state",
      },
    ];
  },
};

export default nextConfig;
