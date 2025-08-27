import "dotenv/config";

import { drizzle } from "drizzle-orm/libsql";
import { seed } from "drizzle-seed";

import { Group } from "@/lib/constants";
import * as schema from "@/lib/db/schemas";
import { groups } from "./groups";

const db = drizzle(process.env.DATABASE_URL!, {
  casing: "snake_case",
});

async function main() {
  for (const group of groups) {
    await db
      .insert(schema.groups)
      .values({
        id: group.id as Group,
        description: group.description,
      })
      .onConflictDoUpdate({
        target: schema.groups.id,
        set: {
          description: group.description,
        },
      });
  }

  await seed(
    db,
    {
      users: schema.users,
      questions: schema.questions,
      applications: schema.applications,
      memberships: schema.memberships,
    },
    {
      seed: Math.floor(Math.random() * 1000),
      count: 100,
    },
  ).refine((f) => ({
    applications: {
      columns: {
        groupId: f.valuesFromArray({
          values: [...schema.groupEnum],
        }),
        year: f.valuesFromArray({
          values: [...schema.yearEnum],
        }),
        study: f.valuesFromArray({
          values: [...schema.studyEnum],
        }),
      },
    },
  }));
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("An error occurred during the seeding process.");
    console.log(err);
    process.exit(1);
  });
