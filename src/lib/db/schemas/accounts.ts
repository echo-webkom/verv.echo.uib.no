import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { users } from "./users";

export const accounts = pgTable(
  "account",
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    accessToken: text(),
  },
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export type Account = InferSelectModel<typeof accounts>;
