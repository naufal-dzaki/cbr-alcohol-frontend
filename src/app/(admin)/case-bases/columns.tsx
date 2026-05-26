"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CaseBaseActionCell } from "./case-base-action-cell";

export type CaseBaseData = {
  id: number;
  sex: number;
  address: number;
  pstatus: number;
  romantic: number;
  famrel: number;
  studytime: number;
  failures: number;
  absences: number;
  freetime: number;
  goout: number;
  ground_truth_score: number;
  label: string;
  is_synthetic: boolean;
  created_at: string;
};

export const columns: ColumnDef<CaseBaseData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>,
  },
  {
    id: "features",
    header: "Fitur Kategorikal",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex gap-1 text-xs text-muted-foreground">
          <Badge variant="outline">Sex: {data.sex === 1 ? 'M' : 'F'}</Badge>
          <Badge variant="outline">Addr: {data.address === 1 ? 'U' : 'R'}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "absences",
    header: "Absences",
    cell: ({ row }) => <span className="text-sm">{row.original.absences.toFixed(2)}</span>,
  },
  {
    accessorKey: "ground_truth_score",
    header: "GT Score",
    cell: ({ row }) => <span className="font-medium">{row.original.ground_truth_score.toFixed(2)}</span>,
  },
  {
    accessorKey: "label",
    header: "Label Status",
    filterFn: (row, id, value) => value === row.getValue(id),
    cell: ({ row }) => {
      const label = row.original.label;
      let colorClass = "bg-green-100 text-green-800";
      if (label === "Waspada") colorClass = "bg-yellow-100 text-yellow-800";
      if (label === "Bahaya") colorClass = "bg-red-100 text-red-800";
      
      return (
        <Badge variant="secondary" className={colorClass}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "is_synthetic",
    header: "Tipe Data",
    filterFn: (row, id, value) => value === (row.getValue(id) ? "true" : "false"),
    cell: ({ row }) => {
      const isSynthetic = row.original.is_synthetic;
      return (
        <Badge variant={isSynthetic ? "default" : "outline"} className={isSynthetic ? "bg-blue-600" : ""}>
          {isSynthetic ? "SMOTE" : "Original"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CaseBaseActionCell caseData={row.original} />,
  },
];