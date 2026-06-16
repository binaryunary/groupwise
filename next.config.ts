import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode overlay so it doesn't obscure UI in screenshots.
  devIndicators: false,
};

export default nextConfig;
