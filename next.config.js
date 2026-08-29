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
  async redirects() {
    return [
      {
        source: "/sitemap",
        destination: "/sitemap.xml",
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
  },
};

module.exports = nextConfig;

