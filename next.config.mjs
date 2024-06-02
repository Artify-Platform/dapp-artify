/** @type {import('next').NextConfig} */
import withPWAInit from 'next-pwa'
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NEXT_PUBLIC_NODE_ENV === 'development',
  // disable: true,
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
}

export default withPWA({
  // next.js config
  nextConfig,
  images: {
    domains: ['pub-3626123a908346a7a8be8d9295f44e26.r2.dev', 'imiblockchain.com'],
  },
  output: 'standalone',
  reactStrictMode: false,
  swcMinify: true,
})
