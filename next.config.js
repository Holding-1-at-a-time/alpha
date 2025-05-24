/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Handle subdomain routing - fixing the invalid rewrite configuration
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: ":tenant.example.com",
          },
        ],
        destination: "/:tenant/:path*",
      },
    ]
  },
  // Ensure environment variables are available
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
