/** @type {import('next').NextConfig} */
const nextConfig: any = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixmapwjvcahugcpmetz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
