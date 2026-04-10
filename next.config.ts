import type { NextConfig } from "next";
import createMdx from "@next/mdx";
import { withPlausibleProxy } from "next-plausible";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [100, 75],
  },
};

const withMdx = createMdx({
  extension: /\.(md|mdx)$/,
});

export default withPlausibleProxy({
  src: process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL!,
})(withMdx(nextConfig));
