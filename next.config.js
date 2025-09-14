/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // ✅
  reactStrictMode: true,
  images: { unoptimized: true } ,
  typescript: {
    ignoreBuildErrors: true, // ✅ disables type-checking at build
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables linting at build
  },
};

module.exports = nextConfig;
