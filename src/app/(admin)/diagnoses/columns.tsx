"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DiagnosisActionCell } from "./diagnosis-action-cell";

export type DiagnosisData = {
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
  k_used: number;
  max_similarity: number;
  predicted_label: string;
  status: "PENDING" | "APPROVED" | "REVISED" | "REJECTED";
  created_at: string;
};

export const columns: ColumnDef<DiagnosisData>[] = [
  {
    accessorKey: "id",
    header: "ID Kasus",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Masuk",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return <span className="text-sm">{date.toLocaleDateString('id-ID')}</span>;
    },
  },
  {
    accessorKey: "max_similarity",
    header: "Similarity",
    cell: ({ row }) => (
      <span className="font-medium text-blue-600">
        {(row.original.max_similarity * 100).toFixed(2)}%
      </span>
    ),
  },
  {
    accessorKey: "predicted_label",
    header: "Prediksi Sistem",
    filterFn: (row, id, value) => value === row.getValue(id),
    cell: ({ row }) => {
      const label = row.original.predicted_label;
      let color = "bg-green-100 text-green-800";
      if (label === "Waspada") color = "bg-yellow-100 text-yellow-800";
      if (label === "Bahaya") color = "bg-red-100 text-red-800";
      return <Badge variant="secondary" className={color}>{label}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status Validasi",
    filterFn: (row, id, value) => value === row.getValue(id),
    cell: ({ row }) => {
      const status = row.original.status;
      switch (status) {
        case "PENDING": return <Badge variant="outline" className="border-orange-500 text-orange-500">Menunggu Review</Badge>;
        case "APPROVED": return <Badge className="bg-green-600 hover:bg-green-600">Disetujui</Badge>;
        case "REVISED": return <Badge className="bg-blue-600 hover:bg-blue-600">Direvisi</Badge>;
        case "REJECTED": return <Badge variant="destructive">Ditolak</Badge>;
        default: return <Badge>{status}</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DiagnosisActionCell diagnosis={row.original} />,
  },
];