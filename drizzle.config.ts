import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./src/lib/db/schemas/index.ts",
  dialect: "sqlite",
  casing: "snake_case",
});
