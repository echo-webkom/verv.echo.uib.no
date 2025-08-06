declare module "*.mdx" {
  import type { MDXComponents } from "mdx/types";
  import type { ComponentType } from "react";

  const Component: ComponentType<{ components?: MDXComponents }>;
  export default Component;
}
