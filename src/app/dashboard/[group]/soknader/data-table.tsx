"use client";

import { Fragment } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { groupNames } from "@/lib/constants";
import { SelectApplicationByGroupQuery } from "@/lib/db/queries";
import { ExpandedRowsProvider, useExpandedRows } from "./columns";

const CopyIdButton = ({ application }: { application: SelectApplicationByGroupQuery[number] }) => {
  const { toast } = useToast();

  const handleClick = () => {
    navigator.clipboard.writeText(application.id);
    toast({
      title: "Kopierte søknads-ID",
      description: "Søknads-IDen er nå kopiert til utklippstavlen",
    });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} className="h-7 px-2 text-xs">
      <Copy className="mr-1 h-3 w-3" />
      Kopier ID
    </Button>
  );
};

const TableActions = ({ data }: { data: SelectApplicationByGroupQuery }) => {
  const { expandAll, collapseAll, expandedRows } = useExpandedRows();
  const allIds = data.map((item) => item.id);
  const allExpanded = allIds.length > 0 && allIds.every((id) => expandedRows.has(id));
  const group = data[0].groupId;

  return (
    <div className="mb-4 flex gap-2">
      <Button size="sm" onClick={() => expandAll(allIds)} disabled={allExpanded} className="h-8">
        <ChevronDown className="mr-1 h-3 w-3" />
        Utvid alle
      </Button>
      <Button size="sm" onClick={collapseAll} disabled={expandedRows.size === 0} className="h-8">
        <ChevronRight className="mr-1 h-3 w-3" />
        Lukk alle
      </Button>

      <a
        href={`/${group}/sokere`}
        className="ml-auto text-lg text-blue-500 hover:underline"
        title="Last ned som CSV"
        download
      >
        Last ned som CSV
      </a>
    </div>
  );
};

const ExpandableRowContent = ({
  application,
}: {
  application: SelectApplicationByGroupQuery[number];
}) => {
  return (
    <div className="bg-accent/30 px-4 pt-2 pb-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
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
          <div className="space-y-2">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Årstrinn</span>
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

        <div className="space-y-2">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Søkt hos</span>
            <span className="text-sm">
              {application.user.applications.map((app) => groupNames[app.groupId]).join(", ")}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Søknadstekst</span>
          <div className="bg-accent max-h-40 overflow-y-auto rounded-lg border p-3">
            <div className="space-y-2 text-sm">
              {application.body.split("\n").map((line, i) => (
                <p key={i} className="leading-relaxed">
                  {line || "\u00A0"}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <CopyIdButton application={application} />
        </div>
      </div>
    </div>
  );
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function DataTableContent({
  columns,
  data,
}: {
  columns: ColumnDef<SelectApplicationByGroupQuery[number], unknown>[];
  data: SelectApplicationByGroupQuery;
}) {
  const { expandedRows } = useExpandedRows();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <TableActions data={data} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const application = row.original;
                const isExpanded = expandedRows.has(application.id);

                return (
                  <Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${row.id}-expanded`} className="hover:bg-transparent">
                        <TableCell colSpan={columns.length} className="p-0">
                          <ExpandableRowContent application={application} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  return (
    <ExpandedRowsProvider>
      <DataTableContent
        columns={columns as ColumnDef<SelectApplicationByGroupQuery[number], unknown>[]}
        data={data as SelectApplicationByGroupQuery}
      />
    </ExpandedRowsProvider>
  );
}
