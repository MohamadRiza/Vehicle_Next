/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, 
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://vehicle-wait-riza.created.app/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
