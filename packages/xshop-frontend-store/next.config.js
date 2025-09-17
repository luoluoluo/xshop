/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xltzx.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
  // cacheHandler: require.resolve("./cache-handler.js"),
  cacheMaxMemorySize: 0, // disable default in-memory caching
};

module.exports = nextConfig;
