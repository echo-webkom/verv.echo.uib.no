import type { NextConfig } from "next";
import createMdx from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import dotenv from "dotenv";

dotenv.config({
  path: ".dev.vars",
});

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

initOpenNextCloudflareForDev();

export default withMdx(nextConfig);
