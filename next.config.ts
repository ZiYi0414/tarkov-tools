import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // <CHANGE> 移除 ignoreBuildErrors，让真正的错误暴露出来
  images: {
    unoptimized: true,
  },
  // <CHANGE> 确保输出为独立模式，适合Vercel部署
  output: 'standalone',
}

export default nextConfig
