/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "your-backend-url.railway.app", "your-bucket-name.s3.amazonaws.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/editor",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;