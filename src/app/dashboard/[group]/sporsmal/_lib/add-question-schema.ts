import { z } from "zod";

export const addQuestionSchema = z
  .object({
    label: z.string().min(1, "Spørsmålet må ha en tittel."),
    description: z.string().optional(),
    required: z.boolean(),
    placeholder: z.string().optional(),
    type: z.enum(["input", "textarea", "checkbox", "select"], {
      error: () => ({
        message: "Du må velge en gyldig type.",
      }),
    }),
    options: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (
        (data.type === "checkbox" || data.type === "select") &&
        (!data.options || data.options.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Checkbox og select spørsmål må ha minst ett alternativ.",
      path: ["options"],
    },
  )
  .refine(
    (data) => {
      if (data.options && data.options.length > 0) {
        const normalizedOptions = data.options
          .map((opt) => opt.trim().toLowerCase())
          .filter((opt) => opt !== "");
        const uniqueOptions = new Set(normalizedOptions);
        return normalizedOptions.length === uniqueOptions.size;
      }
      return true;
    },
    {
      message: "Alternativene kan ikke være like.",
      path: ["options"],
    },
  )
  .refine(
    (data) => {
      if (data.options && data.options.length > 0) {
        return data.options.every((opt) => opt.trim() !== "");
      }
      return true;
    },
    {
      message: "Alternativene kan ikke være tomme.",
      path: ["options"],
    },
  );
