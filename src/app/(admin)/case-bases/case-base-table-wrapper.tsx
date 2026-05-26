"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { columns, CaseBaseData } from "./columns";
import { DataTableFilterableColumn } from "@/components/ui/data-table/data-table-toolbar";

export function CaseBaseTableWrapper({ data }: { data: CaseBaseData[] }) {
  const filterableColumns: DataTableFilterableColumn<CaseBaseData>[] = [
    {
      id: "label",
      title: "Label",
      options: [
        { label: "Normal", value: "Normal" },
        { label: "Waspada", value: "Waspada" },
        { label: "Bahaya", value: "Bahaya" },
      ],
    },
    {
      id: "is_synthetic",
      title: "Tipe Data",
      options: [
        { label: "Original", value: "false" },
        { label: "SMOTE (Sintetis)", value: "true" },
      ],
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={data} 
      globalSearchPlaceholder="Cari berdasarkan ID atau atribut..."
      filterableColumns={filterableColumns} 
    />
  );
}