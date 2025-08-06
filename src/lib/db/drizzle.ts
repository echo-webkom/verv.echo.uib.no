import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schemas";

export const getDb = cache(async () => {
  const context = await getCloudflareContext({ async: true });
  const { DB } = context.env;

  return drizzle(DB, { schema, casing: "snake_case" });
});
