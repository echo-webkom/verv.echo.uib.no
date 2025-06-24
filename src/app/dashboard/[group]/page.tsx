import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditIcon, FileTextIcon, UsersIcon } from "lucide-react";

import { auth } from "@/lib/auth/lucia";
import { Group, groupNames } from "@/lib/constants";
import { isMemberOf } from "@/lib/is-member-of";

type Props = {
  params: Promise<{
    group: Group;
  }>;
};

export default async function GroupDashboard({ params }: Props) {
  const user = await auth();
  const { group } = await params;

  if (!user || !isMemberOf(user, [group, "webkom"])) {
    return redirect("/logg-inn");
  }

  if (!Object.keys(groupNames).includes(group)) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Dashboard for {groupNames[group]}</h1>

      <div className="flex flex-col gap-2">
        {[
          {
            label: "Rediger side",
            href: `/${group}/rediger`,
            icon: EditIcon,
            description: "Rediger informasjon og innhold for undergruppen",
          },
          {
            label: "Se søkere",
            href: `/dashboard/${group}/soknader`,
            icon: UsersIcon,
            description: "Se og administrer innkomne søknader",
          },
          {
            label: "Endre søknadstekst",
            href: `/dashboard/${group}/sporsmal`,
            icon: FileTextIcon,
            description: "Rediger spørsmål i søknadsskjemaet",
          },
        ].map(({ label, href, icon: Icon, description }) => (
          <div key={href}>
            <Link
              className="text-muted-foreground block rounded-lg border-2 p-6 hover:underline"
              href={href}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="text-lg font-medium">{label}</span>
              </div>
              <p className="text-muted-foreground/70 mt-2 ml-8 text-sm">{description}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
