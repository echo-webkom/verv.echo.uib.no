import { cache } from "react";
import { asc, desc, eq } from "drizzle-orm";

import { Group } from "../constants";
import { getDb } from "./drizzle";

export const selectAllUsers = cache(() => {
  const db = getDb();

  return db.query.users.findMany({
    with: {
      memberships: true,
    },
    orderBy: (user) => desc(user.name),
  });
});

export type SelectApplicationByGroupQuery = Awaited<ReturnType<typeof selectApplicationsByGroup>>;

export const selectApplicationsByGroup = cache((group: Group) => {
  const db = getDb();

  return db.query.applications.findMany({
    where: (application) => eq(application.groupId, group),
    orderBy: (application) => asc(application.createdAt),
    with: {
      user: {
        with: {
          applications: {
            columns: {
              groupId: true,
            },
          },
        },
      },
    },
  });
});

export const selectApplicationsByUser = cache((userId: string) => {
  const db = getDb();

  return db.query.applications.findMany({
    where: (application) => eq(application.userId, userId),
    orderBy: (application) => desc(application.createdAt),
  });
});
