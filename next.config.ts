import type { NextConfig } from "next";
import createMdx from "@next/mdx";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [100, 75],
  },
};

const withMdx = createMdx({
  extension: /\.(md|mdx)$/,
});

export default withMdx(nextConfig);
