/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
