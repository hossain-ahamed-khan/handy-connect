import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [
      "placehold.co", 
      "handyapi.dsrt321.online",
      "api.vonabisz.de",
      "unsplash.com", 
      "images.unsplash.com"
    ],
  },
};

export default nextConfig;