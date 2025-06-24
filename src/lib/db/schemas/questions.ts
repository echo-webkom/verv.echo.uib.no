import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { groups } from "./groups";

export const questions = sqliteTable(
  "question",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    groupId: text().notNull(),
    label: text().notNull(),
    description: text(),
    required: integer({ mode: "boolean" }).notNull().default(false),
    placeholder: text(),
    order: integer().notNull(),
    type: text({ enum: ["input", "textarea", "checkbox", "select"] }).notNull(),
    options: text(), // JSON string for select/checkbox options
  },
  (t) => [index("groupId_idx").on(t.groupId)],
);

export const questionsRelations = relations(questions, ({ one }) => ({
  group: one(groups, {
    fields: [questions.groupId],
    references: [groups.id],
  }),
}));

export type Question = InferSelectModel<typeof questions>;
export type QuestionInsert = InferInsertModel<typeof questions>;
