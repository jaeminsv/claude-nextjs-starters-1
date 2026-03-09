import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Opt @react-pdf/renderer out of bundling so Next.js uses native Node.js require().
  // This prevents Turbopack/webpack from trying to bundle Node.js-only modules
  // (canvas, path, fs, etc.) that @react-pdf/renderer depends on.
  // Note: Next.js 15 moved this from experimental.serverComponentsExternalPackages
  // to the top-level serverExternalPackages key.
  serverExternalPackages: ['@react-pdf/renderer'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig
