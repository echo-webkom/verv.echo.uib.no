"use client";

import { createContext, useContext, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SelectApplicationByGroupQuery } from "@/lib/db/queries";
import { Application } from "@/lib/db/schemas";

const ExpandedRowsContext = createContext<{
  expandedRows: Set<string>;
  toggleRow: (id: string) => void;
  expandAll: (ids: string[]) => void;
  collapseAll: () => void;
} | null>(null);

export const useExpandedRows = () => {
  const context = useContext(ExpandedRowsContext);
  if (!context) {
    throw new Error("useExpandedRows must be used within ExpandedRowsProvider");
  }
  return context;
};

export const ExpandedRowsProvider = ({ children }: { children: React.ReactNode }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = (ids: string[]) => {
    setExpandedRows(new Set(ids));
  };

  const collapseAll = () => {
    setExpandedRows(new Set());
  };

  return (
    <ExpandedRowsContext.Provider value={{ expandedRows, toggleRow, expandAll, collapseAll }}>
      {children}
    </ExpandedRowsContext.Provider>
  );
};

const ExpandToggleButton = ({ application }: { application: Application }) => {
  const { expandedRows, toggleRow } = useExpandedRows();
  const isExpanded = expandedRows.has(application.id);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleRow(application.id)}
      className="h-8 w-8 p-0 hover:bg-transparent"
    >
      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </Button>
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
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const application = row.original;

      return <ExpandToggleButton application={application} />;
    },
  },
];
