/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, 
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://rmikrositqccszckqyhg.supabase.co"
      }
    ]
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
