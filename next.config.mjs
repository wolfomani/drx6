/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعدادات الأداء
  compress: true,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  
  // إعدادات البناء
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // إعدادات الصور
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },
  
  // تحسين الحزم
  experimental: {
    optimizePackageImports: [
      '@/components/ui',
      'lucide-react',
    ],
  },
  
  // إعدادات الأمان
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
  
  // إعدادات webpack للتحسين
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // تحسين تقسيم الحزم
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    }
    
    return config
  },
}

export default nextConfig
