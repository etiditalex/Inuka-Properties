/** @type {import('next').NextConfig} */
const remotePatterns = [
  {
    protocol: "https",
    hostname: "res.cloudinary.com",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
  },
  {
    protocol: "https",
    hostname: "*.supabase.co",
    pathname: "/storage/v1/object/public/**",
  },
];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const hostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    if (!remotePatterns.some((p) => p.hostname === hostname)) {
      remotePatterns.push({
        protocol: "https",
        hostname,
        pathname: "/storage/v1/object/public/**",
      });
    }
  } catch {
    // ignore invalid URL
  }
}

const nextConfig = {
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/bofa-projects",
        destination: "/bofa-phase-21",
        permanent: true,
      },
      {
        source: "/book-site-visit",
        destination: "/?book-visit=1",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/miliki-tezo-na-inuka", destination: "/for-sale/3" },
      { source: "/tulivu-haven", destination: "/for-sale/14" },
      { source: "/malindi-airport-gardens", destination: "/for-sale/6" },
      { source: "/bofa-platinum", destination: "/for-sale/1" },
      { source: "/bofa-phase-21", destination: "/for-sale/8" },
    ];
  },
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

