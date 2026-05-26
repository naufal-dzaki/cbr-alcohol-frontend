"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { EvaluationActionCell } from "./evaluation-action-cell";

export type EvaluationData = {
  id: number;
  split_ratio: string;
  k_value: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  is_active: boolean;
};

export const columns: ColumnDef<EvaluationData>[] = [
  {
    accessorKey: "k_value",
    header: "Nilai K",
    cell: ({ row }) => <span className="font-bold text-lg">K = {row.original.k_value}</span>,
  },
  {
    accessorKey: "split_ratio",
    header: "Rasio (Train:Test)",
    cell: ({ row }) => <Badge variant="outline">{row.original.split_ratio}</Badge>,
  },
  {
    accessorKey: "accuracy",
    header: "Akurasi",
    cell: ({ row }) => <span className="font-medium text-green-600">{row.original.accuracy}%</span>,
  },
  {
    accessorKey: "precision",
    header: "Precision",
    cell: ({ row }) => <span>{row.original.precision}%</span>,
  },
  {
    accessorKey: "recall",
    header: "Recall",
    cell: ({ row }) => <span>{row.original.recall}%</span>,
  },
  {
    accessorKey: "f1_score",
    header: "F1-Score",
    cell: ({ row }) => <span>{row.original.f1_score}%</span>,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-blue-600" : ""}>
          {isActive ? "Aktif (Dipakai)" : "Tidak Aktif"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <EvaluationActionCell evaluation={row.original} />,
  },
];