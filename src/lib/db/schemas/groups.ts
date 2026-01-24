import { JSONContent } from "@tiptap/react";
import { relations } from "drizzle-orm";
import { json, pgTable, text } from "drizzle-orm/pg-core";

import { groupEnum } from "./enums";
import { memberships } from "./memberships";
import { questions } from "./questions";

export const groups = pgTable("group", {
  id: text({ enum: groupEnum }).notNull().primaryKey(),
  description: json().$type<JSONContent>(),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  members: many(memberships),
  questions: many(questions),
}));
