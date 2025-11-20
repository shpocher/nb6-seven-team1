import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // 백엔드 포트
      },
      {
        protocol: 'https',
        hostname: 'sprint-be-project.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/groups/:groupId((?!/new).)*',
        destination: '/groups/:groupId*/records',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
