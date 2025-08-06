import { cache } from "react";
import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql/web";

import * as schema from "./schemas";

const url = process.env.DATABASE_URL as string;
const authToken = process.env.DATABASE_AUTH_TOKEN;

export const getDb = cache(() => {
  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client, { schema, casing: "snake_case" });
});
