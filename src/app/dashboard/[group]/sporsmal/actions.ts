"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth/lucia";
import { Group } from "@/lib/constants";
import { db } from "@/lib/db/drizzle";
import { questions } from "@/lib/db/schemas";
import { isMemberOf } from "@/lib/is-member-of";
import { addQuestionSchema } from "./_lib/add-question-schema";

export const addQuestionAction = async (
  groupId: Group,
  data: z.infer<typeof addQuestionSchema>,
) => {
  const user = await auth();

  if (!user) {
    return {
      result: "error",
      message: "Du må logge inn for å søke",
    };
  }

  if (!isMemberOf(user, [groupId, "webkom"])) {
    return {
      result: "error",
      message: "Du er ikke medlem av gruppen",
    };
  }

  const { data: parsed, success } = addQuestionSchema.safeParse(data);
  if (!success) {
    return {
      result: "error",
      message: "Ugyldig data",
    };
  }

  const existingQuestions = await db.query.questions.findMany({
    where: (questions, { eq }) => eq(questions.groupId, groupId),
  });
  const n = existingQuestions.length;

  await db.insert(questions).values({
    ...parsed,
    options: parsed.options ? JSON.stringify(parsed.options) : null,
    order: n,
    groupId,
  });

  return {
    result: "success",
    message: "Spørsmål opprettet",
  };
};

export const changeQuestionOrderAction = async (
  groupId: Group,
  newQuestionsOrder: Array<string>,
) => {
  const user = await auth();

  if (!user) {
    return {
      result: "error",
      message: "Du må logge inn for å søke",
    };
  }

  if (!isMemberOf(user, [groupId, "webkom"])) {
    return {
      result: "error",
      message: "Du er ikke medlem av gruppen",
    };
  }

  const updateOrders = newQuestionsOrder.map((id) => {
    return db
      .update(questions)
      .set({ order: newQuestionsOrder.indexOf(id) })
      .where(eq(questions.id, id));
  });

  await Promise.all(updateOrders);

  return {
    result: "success",
    message: "Endret rekkefølge på spørsmål",
  };
};

export const deleteQuestionAction = async (questionId: string) => {
  const user = await auth();

  if (!user) {
    return {
      result: "error",
      message: "Du må logge inn for å søke",
    };
  }

  const question = await db.query.questions.findFirst({
    where: (questions, { eq }) => eq(questions.id, questionId),
  });

  if (!question) {
    return {
      result: "error",
      message: "Spørsmålet finnes ikke",
    };
  }

  if (!isMemberOf(user, [question.groupId as Group, "webkom"])) {
    return {
      result: "error",
      message: "Du er ikke medlem av gruppen",
    };
  }

  await db.delete(questions).where(eq(questions.id, questionId));

  return {
    result: "success",
    message: "Spørsmål slettet",
  };
};
