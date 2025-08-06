"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth/lucia";
import { getDb } from "@/lib/db/drizzle";
import { memberships } from "@/lib/db/schemas";
import { isWebkom } from "@/lib/is-member-of";
import { userFormSchema } from "./schemas";

type Response =
  | {
      result: "success";
    }
  | {
      result: "error";
      message: string;
    };

export const updateUserAction = async (
  userId: string,
  data: z.infer<typeof userFormSchema>,
): Promise<Response> => {
  try {
    const db = getDb();
    const actionUser = await auth();

    if (!actionUser) {
      return {
        result: "error",
        message: "Unauthorized",
      };
    }

    if (!isWebkom(actionUser)) {
      return {
        result: "error",
        message: "Unauthorized",
      };
    }

    const { groups } = userFormSchema.parse(data);

    await db.delete(memberships).where(eq(memberships.userId, userId));

    await db.insert(memberships).values(
      groups.map((groupId) => ({
        groupId,
        userId,
      })),
    );

    revalidatePath("/dashboard/admin");

    return {
      result: "success",
    };
  } catch {
    return {
      result: "error",
      message: "Something went wrong",
    };
  }
};
