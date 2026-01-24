import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { groupEnum, studyEnum, yearEnum } from "./enums";
import { users } from "./users";

export const applications = pgTable(
  "application",
  {
    id: text().notNull().primaryKey().$defaultFn(nanoid),
    name: text().notNull(),
    email: text().notNull(),
    year: text({ enum: yearEnum }).notNull(),
    study: text({ enum: studyEnum }).notNull(),
    body: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id),
    groupId: text({ enum: groupEnum }).notNull(),
    createdAt: timestamp()
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("group_email_index").on(t.groupId, t.email)],
);

export const applicationsRelations = relations(applications, ({ one }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
}));

export type Application = InferSelectModel<typeof applications>;
