const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Pages
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Enable trailing slashes for consistent URLs
  trailingSlash: true,

  // Optimize for production
  compress: true,
  poweredByHeader: false,

  // Security headers (fallback - Cloudflare Pages uses _headers file)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Cloudflare Pages optimization
  experimental: {
    optimizeCss: true,
  },

  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,

  // Configure TypeScript and ESLint checks
  typescript: {
    // Fail build on type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Fail build on lint errors in production
    ignoreDuringBuilds: false,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
