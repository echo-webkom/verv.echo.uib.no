import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schemas";

const url = process.env.DATABASE_URL as string;

const client = postgres(url);

export const db = drizzle(client, { schema, casing: "snake_case" });
