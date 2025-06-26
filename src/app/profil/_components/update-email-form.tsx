"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAlternativeEmail } from "../actions";

type UpdateEmailForm = {
  email: string;
};

export const UpdateEmailForm = ({ email }: UpdateEmailForm) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await updateAlternativeEmail(formData);
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="alternativeEmail">E-post</Label>
        <Input
          id="alternativeEmail"
          name="alternativeEmail"
          type="email"
          placeholder="din.epost@example.com"
          defaultValue={email}
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="self-start" disabled={isPending}>
        {isPending ? "Lagrer..." : "Lagre"}
      </Button>
    </form>
  );
};
