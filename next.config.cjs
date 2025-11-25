// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true
// };
// module.exports = nextConfig;



// next.config.cjs
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // pastikan @ mengarah ke folder src
      '@': path.resolve(__dirname, 'src'),
      '@/*': path.resolve(__dirname, 'src'), // defensif, optional
    };
    return config;
  },
};

module.exports = nextConfig;
