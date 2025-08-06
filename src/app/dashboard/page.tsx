import { cache } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/lucia";
import { Group, groupNames } from "@/lib/constants";
import { getDb } from "@/lib/db/drizzle";
import { applications } from "@/lib/db/schemas";
import { isWebkom } from "@/lib/is-member-of";
import { WebkomVsBedkom } from "./_components/webkom-vs-bedkom";
import { WebkomVsConsulting } from "./_components/webkom-vs-consulting";

const applicationCountStmt = cache(() => {
  const db = getDb();

  return db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(applications);
});

export default async function Dashboard() {
  const user = await auth();

  if (!user || !user.groups.length) {
    return redirect("/logg-inn");
  }

  const applicationCount = await applicationCountStmt()
    .execute()
    .then((res) => res[0].count);

  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p>Totalt antall søkere: {applicationCount}</p>

      <WebkomVsBedkom />
      <WebkomVsConsulting />

      {isWebkom(user) && (
        <Button className="w-full" asChild>
          <Link href="/dashboard/admin">Til admin dashboard</Link>
        </Button>
      )}

      <ul className="divide-y">
        {Object.entries(groupNames).map(([id, name]) => {
          const isMember = user.groups.includes(id as Group) || isWebkom(user);

          if (!isMember) {
            return null;
          }

          return (
            <li className="flex flex-col py-3" key={id}>
              <a className="group" href={`/dashboard/${id}`}>
                <span className="mr-2">{isMember ? "✅" : "❌"}</span>
                <span className="group-hover:underline">{name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
