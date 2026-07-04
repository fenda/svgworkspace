import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export only — the server serves files; all SVG work runs in the browser.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
