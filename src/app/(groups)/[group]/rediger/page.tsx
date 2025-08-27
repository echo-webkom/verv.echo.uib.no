import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth/lucia";
import { Group, groupNames } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import { isMemberOf } from "@/lib/is-member-of";
import { UpdateDescription } from "./_components/edit-description";

type Props = {
  params: Promise<{
    group: Group;
  }>;
};

export default async function GroupEditor({ params }: Props) {
  const { group } = await params;
  const user = await auth();

  if (!user || !isMemberOf(user, [group, "webkom"])) {
    return redirect("/logg-inn");
  }

  if (!Object.keys(groupNames).includes(group)) {
    return notFound();
  }

  const g = await db.query.groups.findFirst({
    where: (row, { eq }) => eq(row.id, group),
  });

  const description = g?.description ?? undefined;

  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard for {groupNames[group]}</h1>

      <UpdateDescription group={group} description={description} />
    </>
  );
}
