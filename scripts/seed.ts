import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import { seed } from "drizzle-seed";
import postgres from "postgres";

import { Group } from "@/lib/constants";
import * as schema from "@/lib/db/schemas";
import { groups } from "./groups";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, {
  schema,
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

  await seed(db as any, {
    users: schema.users,
    questions: schema.questions,
    applications: schema.applications,
    memberships: schema.memberships,
  }).refine((f) => ({
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

  await client.end();
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
