import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/lucia";
import { selectAllUsers } from "@/lib/db/queries";
import { isMemberOf } from "@/lib/is-member-of";
import { columns } from "./user-columns";
import { DataTable } from "./user-data-table";

export default async function AdminDashboard() {
  const user = await auth();

  if (!user || !isMemberOf(user, ["webkom"])) {
    return redirect("/");
  }

  const users = await selectAllUsers();

  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard for admin</h1>

      <p>Antall brukere: {users.length}</p>

      <DataTable columns={columns} data={users} />
    </>
  );
}
