import { defineConfig } from 'next';

const config = defineConfig({
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
  compiler: {
    styledComponents: true,
  },
});

export default config;