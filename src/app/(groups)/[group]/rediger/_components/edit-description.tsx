"use client";

import { useState, useTransition } from "react";
import { JSONContent } from "@tiptap/react";

import { updateGroupDescription } from "@/actions/update-group-description";
import { Editor } from "@/components/editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Group } from "@/lib/constants";

type UpdateDescriptionProps = {
  group: Group;
  description?: JSONContent;
};

export const UpdateDescription = ({ group, description }: UpdateDescriptionProps) => {
  const { toast } = useToast();
  const [value, setValue] = useState(description);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    startTransition(async () => {
      if (!value) return;
      const { success } = await updateGroupDescription(group, value);

      if (success) {
        toast({
          title: "Beskrivelse oppdatert",
          variant: "default",
        });
      } else {
        toast({
          title: "Noe gikk galt",
          description: "Kunne ikke oppdatere beskrivelse",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <Editor value={value} onChange={setValue} />
      <Button disabled={isPending} onClick={onSave}>
        {isPending ? "Lagrer..." : "Lagre"}
      </Button>
    </>
  );
};
