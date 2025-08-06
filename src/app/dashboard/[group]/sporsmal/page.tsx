import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth/lucia";
import { Group, groupNames } from "@/lib/constants";
import { getDb } from "@/lib/db/drizzle";
import { isMemberOf } from "@/lib/is-member-of";
import { MarkdownH1 } from "@/mdx-components";
import { AddQuestionModal } from "./_components/add-question-modal";
import { QuestionsDnd } from "./_components/questions-dnd";

type Props = {
  params: Promise<{
    group: Group;
  }>;
};

export default async function ChangeQuestions({ params }: Props) {
  const db = await getDb();
  const user = await auth();
  const { group } = await params;

  if (!user || !isMemberOf(user, [group, "webkom"])) {
    return redirect("/logg-inn");
  }

  if (!Object.keys(groupNames).includes(group)) {
    return notFound();
  }

  const questions = await db.query.questions.findMany({
    where: (row, { eq }) => eq(row.groupId, group),
  });

  return (
    <div>
      <div className="mb-8">
        <MarkdownH1>Spørsmål</MarkdownH1>
        <p className="text-muted-foreground text-lg">
          Her kan du endre rekkefølgen på spørsmålene ved å dra og slippe dem. Disse spørsmålene vil
          bli vist når en person søker på undergruppen din. Vi vil også legge til standard spørsmål
          som, navn, e-post, årstrinn og studieretning.
        </p>
      </div>

      <QuestionsDnd groupId={group} questions={questions} />

      {questions.length === 0 && (
        <div className="my-10 text-center">
          <p className="text-muted-foreground">Ingen spørsmål er lagt til enda.</p>
          <p className="text-muted-foreground">Legg til spørsmål for å komme i gang!</p>
        </div>
      )}

      <AddQuestionModal group={group} />
    </div>
  );
}
