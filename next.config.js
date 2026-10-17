/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  allowedDevOrigins: ["*.replit.dev", "*.pike.replit.dev", "*"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=31536000",
          },
        ],
      },
    ];
  },
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
