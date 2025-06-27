/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.xltzx.com"
      },
      {
        protocol: "http",
        hostname: "localhost"
      }
    ]
  },
  // cacheHandler: require.resolve("./cache-handler.js"),
  cacheMaxMemorySize: 0 // disable default in-memory caching
};

module.exports = nextConfig;
