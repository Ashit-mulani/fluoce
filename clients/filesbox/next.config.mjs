/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "imagebox.003f36ca54f3d435bb631b29dac00013.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
