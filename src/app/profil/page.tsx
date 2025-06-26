import { redirect } from "next/navigation";
import { AlertCircleIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { auth } from "@/lib/auth/lucia";
import { groupNames } from "@/lib/constants";
import { selectApplicationsByUser } from "@/lib/db/queries";
import { UpdateEmailForm } from "./_components/update-email-form";

export default async function ProfilePage() {
  const user = await auth();

  if (!user) {
    return redirect("/logg-inn");
  }

  const applications = await selectApplicationsByUser(user.id);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 p-16 px-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Din profil</h1>

        <div>
          <p className="text-lg">
            <span className="font-medium">Navn:</span> {user.name}
          </p>
        </div>

        <div className="space-y-4">
          <UpdateEmailForm email={user.alternativeEmail ?? user.email ?? ""} />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Dine verv</h2>

        <ul className="divide-y">
          {user.groups.length === 0 ? (
            <p>Du er ikke medlem av noen verv enda.</p>
          ) : (
            user.groups.map((group) => (
              <li className="flex flex-col py-3" key={group}>
                <a className="group" href={`/dashboard/${group}`}>
                  <span className="group-hover:underline">{groupNames[group]}</span>
                </a>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Dine søknader</h2>

          <div className="flex flex-row gap-5 border p-4">
            <AlertCircleIcon className="text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              Du vil ikke få besvarelse på din søknad gjennom denne nettsiden.
            </p>
          </div>
        </div>

        <div>
          {applications.length === 0 ? (
            <p>Du har ikke søkt på noen verv enda.</p>
          ) : (
            <Accordion type="single" collapsible>
              {applications.map((application) => (
                <AccordionItem key={application.id} value={application.id}>
                  <AccordionTrigger>{groupNames[application.groupId]}</AccordionTrigger>

                  <AccordionContent>
                    <article className="text-muted-foreground rounded-md border p-2">
                      {application.body.split("\n").map((line, i) => (
                        <p className="py-1" key={i}>
                          {line}
                        </p>
                      ))}
                    </article>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </main>
  );
}
