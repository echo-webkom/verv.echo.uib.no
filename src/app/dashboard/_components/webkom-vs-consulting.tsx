import { eq, sql } from "drizzle-orm";

import { auth } from "@/lib/auth/lucia";
import { getDb } from "@/lib/db/drizzle";
import { applications } from "@/lib/db/schemas";
import { isMemberOf } from "@/lib/is-member-of";
import { ProgressBar } from "./progress-bar";

export const WebkomVsConsulting = async () => {
  const db = getDb();
  const user = await auth();

  const webkomCountStmt = db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(applications)
    .where(eq(applications.groupId, "webkom"));

  const consultingCountStmt = db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(applications)
    .where(eq(applications.groupId, "consulting"));

  if (!user) {
    return null;
  }

  const isWebkomOrConsulting = isMemberOf(user, ["webkom", "consulting"]);

  if (!isWebkomOrConsulting) {
    return null;
  }

  const [webkomCount, consultingCount] = await Promise.all([
    webkomCountStmt.execute(),
    consultingCountStmt.execute(),
  ]).then((res) => res.map((r) => r[0].count));

  const percentageWebkom = (webkomCount / (Number(webkomCount) + Number(consultingCount))) * 100;

  return (
    <div className="flex flex-col gap-10 py-4">
      <div className="flex items-center justify-between">
        <div className="w-full text-center">
          <h2 className="font-bold">Webkom</h2>
          <p className="text-6xl">{webkomCount}</p>
        </div>

        <div className="text-lg">vs.</div>

        <div className="w-full text-center">
          <h2 className="font-bold">Consulting</h2>
          <p className="text-6xl">{consultingCount}</p>
        </div>
      </div>

      <div>
        <ProgressBar precentage={percentageWebkom} />
      </div>
    </div>
  );
};
