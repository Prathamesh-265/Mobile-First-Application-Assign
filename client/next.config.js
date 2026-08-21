/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary-hosted attachment previews and Google's public API domains
    // aren't needed here, but Cloudinary is where uploaded files live.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'openweathermap.org' },
    ],
  },
};

module.exports = nextConfig;
