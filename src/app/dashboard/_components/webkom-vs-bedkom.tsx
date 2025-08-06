import { eq, sql } from "drizzle-orm";

import { auth } from "@/lib/auth/lucia";
import { getDb } from "@/lib/db/drizzle";
import { applications } from "@/lib/db/schemas";
import { isMemberOf } from "@/lib/is-member-of";
import { ProgressBar } from "./progress-bar";

export const WebkomVsBedkom = async () => {
  const db = await getDb();
  const user = await auth();

  const webkomCountStmt = db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(applications)
    .where(eq(applications.groupId, "webkom"));

  const bedkomCountStmt = db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(applications)
    .where(eq(applications.groupId, "bedkom"));

  if (!user) {
    return null;
  }

  const isWebkomOrBedkom = isMemberOf(user, ["webkom", "bedkom"]);

  if (!isWebkomOrBedkom) {
    return null;
  }

  const [webkomCount, bedkomCount] = await Promise.all([
    webkomCountStmt.execute(),
    bedkomCountStmt.execute(),
  ]).then((res) => res.map((r) => r[0].count));

  const percentageWebkom = (webkomCount / (Number(webkomCount) + Number(bedkomCount))) * 100;

  return (
    <div className="flex flex-col gap-10 py-4">
      <div className="flex items-center justify-between">
        <div className="w-full text-center">
          <h2 className="font-bold">Webkom</h2>
          <p className="text-6xl">{webkomCount}</p>
        </div>

        <div className="text-lg">vs.</div>

        <div className="w-full text-center">
          <h2 className="font-bold">Bedkom</h2>
          <p className="text-6xl">{bedkomCount}</p>
        </div>
      </div>

      <div>
        <ProgressBar precentage={percentageWebkom} />
      </div>
    </div>
  );
};
