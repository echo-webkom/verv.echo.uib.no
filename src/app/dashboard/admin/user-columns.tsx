"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Group, groupNames } from "@/lib/constants";
import { selectAllUsers } from "@/lib/db/queries";
import { updateUserAction } from "./actions";
import { userFormSchema } from "./schemas";

const ViewDetailsButton = ({
  user,
}: {
  user: Awaited<ReturnType<typeof selectAllUsers>>[number];
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      groups: user.memberships.map((membership) => membership.groupId),
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { result } = await updateUserAction(user.id, data);

    if (result === "success") {
      toast({
        title: "Bruker oppdatert!",
        description: "Brukeren ble oppdatert.",
      });

      form.reset();
      router.refresh();
    }

    if (result === "error") {
      toast({
        title: "Noe gikk galt!",
        description: "Kunne ikke oppdatere brukeren.",
      });
    }
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Se detaljer</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Detaljer for {user.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="mb-2">
            <Label>Navn</Label>
            <p className="text-sm text-slate-500">{user.name}</p>
          </div>

          <div className="mb-2">
            <Label>E-post</Label>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="groups"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Undergrupper</FormLabel>
                      <FormDescription>
                        Velg de undergruppene brukeren er en del av.
                      </FormDescription>
                    </div>

                    {Object.entries(groupNames).map(([id, label]) => (
                      <FormField
                        key={id}
                        control={form.control}
                        name="groups"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={id}
                              className="flex flex-row items-start space-y-0 space-x-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(id as Group)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== id),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                <span>Lagre</span>
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const columns: Array<ColumnDef<Awaited<ReturnType<typeof selectAllUsers>>[number]>> = [
  {
    accessorKey: "name",
    header: "Navn",
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "email",
    header: "E-post",
    sortingFn: "alphanumeric",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ViewDetailsButton user={user} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
