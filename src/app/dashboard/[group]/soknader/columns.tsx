"use client";

import { Dialog, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { groupNames } from "@/lib/constants";
import { SelectApplicationByGroupQuery } from "@/lib/db/queries";
import { Application } from "@/lib/db/schemas";

const CopyIdButton = ({ application }: { application: Application }) => {
  const { toast } = useToast();

  const handleClick = () => {
    navigator.clipboard.writeText(application.id);
    toast({
      title: "Kopierte søknads-ID",
      description: "Søknads-IDen er nå kopiert til utklippstavlen",
    });
  };

  return <DropdownMenuItem onClick={handleClick}>Kopier søknads-ID</DropdownMenuItem>;
};

const ViewDetailsButton = ({ application }: { application: Application }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Se detaljer</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Detaljer for {application.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">E-post</span>
                <span className="text-sm">{application.email}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Studieretning
                </span>
                <span className="text-sm">{application.study}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Årstrinn
                </span>
                <span className="text-sm">{application.year}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sendt inn
                </span>
                <span className="text-sm">{application.createdAt.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Søknadstekst
            </span>
            <div className="bg-accent max-h-60 overflow-y-auto rounded-lg border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {application.body.split("\n").map((line, i) => (
                  <p key={i} className="mb-2 leading-relaxed last:mb-0">
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const columns: Array<ColumnDef<SelectApplicationByGroupQuery[number]>> = [
  {
    accessorKey: "name",
    header: "Navn",
  },
  {
    accessorKey: "email",
    header: "E-post",
  },
  {
    accessorKey: "study",
    header: "Studieretning",
  },
  {
    accessorKey: "year",
    header: "Årstrinn",
  },
  {
    id: "groups",
    header: "Søkt hos",
    cell: ({ row }) => {
      const currentRow = row.original;

      const listStr = currentRow.user.applications
        .map((application) => groupNames[application.groupId])
        .join(", ");

      return <p>{listStr}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Handlinger</DropdownMenuLabel>
            <CopyIdButton application={application} />
            <DropdownMenuSeparator />
            <ViewDetailsButton application={application} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
