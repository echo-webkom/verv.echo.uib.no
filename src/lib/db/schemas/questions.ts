import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { boolean, index, integer, pgTable, text } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { groups } from "./groups";

export const questions = pgTable(
  "question",
  {
    id: text().primaryKey().$defaultFn(nanoid),
    groupId: text().notNull(),
    label: text().notNull(),
    description: text(),
    required: boolean().notNull().default(false),
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
