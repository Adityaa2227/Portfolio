/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  // Commenting out static export config for development
  // output: 'export',
  // distDir: 'out',
  trailingSlash: true,
}

export default nextConfig 