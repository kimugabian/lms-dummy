// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zj5cqtl3yh.ufs.sh",
    }
    ]
  }
}

module.exports = nextConfig;
