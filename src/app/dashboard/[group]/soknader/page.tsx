import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth/lucia";
import { Group, groupNames } from "@/lib/constants";
import { selectApplicationsByGroup } from "@/lib/db/queries";
import { isMemberOf } from "@/lib/is-member-of";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type Props = {
  params: Promise<{
    group: Group;
  }>;
};

export default async function Applications({ params }: Props) {
  const user = await auth();
  const { group } = await params;

  if (!user || !isMemberOf(user, [group, "webkom"])) {
    return redirect("/logg-inn");
  }

  if (!Object.keys(groupNames).includes(group)) {
    return notFound();
  }

  const applications = await selectApplicationsByGroup(group);

  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard for {groupNames[group]}</h1>
      <div className="space-y-4">
        <div>
          {applications.length === 0 ? (
            <p>Ingen søkere enda</p>
          ) : (
            <DataTable columns={columns} data={applications} />
          )}
        </div>
      </div>
    </>
  );
}
