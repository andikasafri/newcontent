/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  // Optimize bundle splitting
  webpack: (config, { isServer }) => {
    // Optimize vendor chunks
    config.optimization.splitChunks = {
      chunks: "all",
      cacheGroups: {
        // Vendor chunk for large third-party dependencies
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Extract vendor name for better debugging
            const packageNameMatch = module.context
              ? module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
              : null;
            const packageName = packageNameMatch
              ? packageNameMatch[1]
              : "unknown";
            return `vendor.${packageName.replace("@", "")}`;
          },
          priority: 20,
        },
        // Common chunk for code shared between pages
        common: {
          name: "common",
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
        },
        // Specific chunk for admin features
        admin: {
          test: /[\\/]components[\\/]admin[\\/]/,
          name: "admin",
          chunks: "async",
          priority: 30,
        },
      },
    };

    // Cache split chunks
    config.cache = {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    };

    return config;
  },
};

module.exports = nextConfig;
