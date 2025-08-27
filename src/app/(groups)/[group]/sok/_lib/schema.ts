import { z } from "zod";

import { Question, studyEnum, yearEnum } from "@/lib/db/schemas";

export const createFormSchema = (questions: Array<Question>) => {
  const dynamicFields: Record<string, z.ZodType<unknown>> = {};

  for (const question of questions) {
    let field;

    const options = question.options ? JSON.parse(question.options) : [];

    if (question.type === "checkbox") {
      const validOptions = z.array(z.enum(options.length > 0 ? options : [""]));
      if (question.required) {
        field = validOptions.min(1, `${question.label} er påkrevd.`);
      } else {
        field = validOptions.optional();
      }
    } else if (question.type === "select") {
      if (options.length > 0) {
        const validOption = z.enum(options);
        if (question.required) {
          field = validOption;
        } else {
          field = validOption.optional();
        }
      } else {
        if (question.required) {
          field = z.string().min(1, `${question.label} er påkrevd.`);
        } else {
          field = z.string().optional();
        }
      }
    } else {
      if (question.required) {
        field = z.string().min(1, `${question.label} er påkrevd.`);
      } else {
        field = z.string().optional();
      }
    }

    dynamicFields[question.id] = field;
  }

  return z.object({
    name: z
      .string()
      .min(2, "Navnet ditt må være minst 2 tegn.")
      .max(255, "Navnet ditt kan ikke være lengre enn 255 tegn."),
    email: z.email().min(1, "E-post er påkrevd."),
    year: z.enum(yearEnum, {
      error: () => ({
        message: "Du må velge et gyldig årstrinn.",
      }),
    }),
    study: z.enum(studyEnum, {
      error: () => ({
        message: "Du må velge en gyldig studieretning.",
      }),
    }),
    questions: z.object(dynamicFields),
  });
};
