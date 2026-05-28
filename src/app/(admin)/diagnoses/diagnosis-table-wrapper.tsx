"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { columns, DiagnosisData } from "./columns";
import { DataTableFilterableColumn } from "@/components/ui/data-table/data-table-toolbar";

export function DiagnosisTableWrapper({ data }: { data: DiagnosisData[] }) {
  const filterableColumns: DataTableFilterableColumn<DiagnosisData>[] = [
    {
      id: "status",
      title: "Status Validasi",
      options: [
        { label: "Menunggu Review (Pending)", value: "PENDING" },
        { label: "Disetujui (Approved)", value: "APPROVED" },
        { label: "Direvisi (Revised)", value: "REVISED" },
        { label: "Ditolak (Rejected)", value: "REJECTED" },
      ],
    },
    {
      id: "predicted_label",
      title: "Prediksi",
      options: [
        { label: "Normal", value: "Normal" },
        { label: "Waspada", value: "Waspada" },
        { label: "Bahaya", value: "Bahaya" },
      ],
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      globalSearchPlaceholder="Cari ID Kasus..."
      filterableColumns={filterableColumns} 
    />
  );
}