import { cache } from "react";
import { notFound } from "next/navigation";

import { FancyLink } from "@/components/fancy-link";
import { RenderJSONContent } from "@/components/render-json-content";
import { getDb } from "@/lib/db/drizzle";

const groups = [
  {
    id: "webkom",
    name: "Webkom",
  },
  {
    id: "tilde",
    name: "Tilde",
  },
  {
    id: "bedkom",
    name: "Bedkom",
  },
  {
    id: "hyggkom",
    name: "Hyggkom",
  },
  {
    id: "gnist",
    name: "Gnist",
  },
  {
    id: "esc",
    name: "echo Sports Club",
  },
  {
    id: "programmerbar",
    name: "Programmerbar",
  },
  {
    id: "consulting",
    name: "echo Consulting",
  },
] as const;

const getData = cache(async (id: string) => {
  const db = await getDb();
  const group = groups.find((group) => group.id === id);

  if (!group) {
    return notFound();
  }

  const content = await db.query.groups
    .findFirst({
      where: (row, { eq }) => eq(row.id, group.id),
    })
    .then((group) => group?.description ?? undefined);

  return {
    ...group,
    content,
  };
});

export const generateStaticParams = async () => {
  return groups.map((group) => ({ group: group.id }));
};

type Props = {
  params: Promise<{
    group: string;
  }>;
};

export const generateMetadata = async ({ params }: Props) => {
  const { group } = await params;
  const g = await getData(group);

  if (!g) {
    return notFound();
  }

  return {
    title: `Søknad ${g.name}`,
    description: `Send søknad til ${g.name}`,
  };
};

export default async function GroupPage({ params }: Props) {
  const { group } = await params;
  const g = await getData(group);

  return (
    <>
      <RenderJSONContent json={g.content} />

      <FancyLink href={`/${group}/sok`} className="my-4">
        Søk her!
      </FancyLink>
    </>
  );
}
