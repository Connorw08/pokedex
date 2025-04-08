import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  /* Ensure that Pokémon images can load. */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'raw.githubusercontent.com' }
    ]
  }
};

export default nextConfig;
