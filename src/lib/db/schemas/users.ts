import { InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { applications } from "./applications";
import { memberships } from "./memberships";

export const users = sqliteTable("user", {
  id: text().primaryKey().$defaultFn(nanoid),
  name: text(),
  email: text().unique(),
  alternativeEmail: text().unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  applications: many(applications),
}));

export type User = InferSelectModel<typeof users>;
