import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users";

export const sessions = pgTable("session", {
  id: text().notNull().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp().notNull(),
});
