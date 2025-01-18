/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.lorem.space',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'api.escuelajs.co',
        pathname: '/api/v1/**',
      },
    ],
  },
  // Enable styled-components
  compiler: {
    styledComponents: true,
  },
}

module.exports = nextConfig