import type { NextConfig } from "next";
import createMdx from "@next/mdx";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-S3cr3t-K0de",
            value: process.env.SECRET_CODE_1 || "default",
          },
        ],
      },
    ];
  },
};

const withMdx = createMdx({
  extension: /\.(md|mdx)$/,
});

export default withMdx(nextConfig);
