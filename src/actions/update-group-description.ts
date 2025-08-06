"use server";

import { JSONContent } from "@tiptap/react";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/lucia";
import { Group } from "@/lib/constants";
import { getDb } from "@/lib/db/drizzle";
import { groups } from "@/lib/db/schemas";
import { isMemberOf } from "@/lib/is-member-of";

export const updateGroupDescription = async (group: Group, description: JSONContent) => {
  const db = getDb();
  const user = await auth();

  if (!user) {
    return {
      success: false,
    };
  }

  if (!isMemberOf(user, [group, "webkom"])) {
    return {
      success: false,
    };
  }

  const groupExists = await db.query.groups.findFirst({
    where: (row, { eq }) => eq(row.id, group),
  });

  if (!groupExists) {
    await db.insert(groups).values({
      id: group,
      description,
    });
  } else {
    await db.update(groups).set({ description }).where(eq(groups.id, group));
  }

  return {
    success: true,
  };
};
