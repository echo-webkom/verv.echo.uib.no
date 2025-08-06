"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth/lucia";
import { getDb } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schemas";

const updateAlternativeEmailSchema = z.object({
  alternativeEmail: z.string().email("Ugyldig e-postadresse").optional(),
});

export const updateAlternativeEmail = async (formData: FormData) => {
  const db = getDb();
  const user = await auth();

  if (!user) {
    return redirect("/logg-inn");
  }

  const data = {
    alternativeEmail: formData.get("alternativeEmail") as string,
  };

  const result = updateAlternativeEmailSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Ugyldig e-postadresse");
  }

  const { alternativeEmail } = result.data;

  try {
    await db
      .update(users)
      .set({
        alternativeEmail: alternativeEmail || null,
      })
      .where(eq(users.id, user.id));

    revalidatePath("/profil");
  } catch {
    throw new Error("Kunne ikke oppdatere e-postadresse");
  }
};
