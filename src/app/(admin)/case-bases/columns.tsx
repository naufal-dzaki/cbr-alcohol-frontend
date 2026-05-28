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

const mapStudyTime = (val: number) => {
  const map: Record<number, string> = { 1: "< 2 Jam", 2: "2 - 5 Jam", 3: "5 - 10 Jam", 4: "> 10 Jam" };
  return map[val] || val;
};

const mapFamRel = (val: number) => {
  const map: Record<number, string> = { 1: "1 - Sangat Buruk", 2: "2 - Buruk", 3: "3 - Cukup", 4: "4 - Baik", 5: "5 - Sangat Baik" };
  return map[val] || val;
};

const mapFreeTime = (val: number) => {
  const map: Record<number, string> = { 1: "1 - Sng. Sedikit", 2: "2 - Sedikit", 3: "3 - Sedang", 4: "4 - Banyak", 5: "5 - Sng. Banyak" };
  return map[val] || val;
};

const mapGoOut = (val: number) => {
  const map: Record<number, string> = { 1: "1 - Sng. Jarang", 2: "2 - Jarang", 3: "3 - Kadang", 4: "4 - Sering", 5: "5 - Sng. Sering" };
  return map[val] || val;
};

export const columns: ColumnDef<CaseBaseData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>,
  },
  {
    id: "demografi",
    header: "Demografi",
    cell: ({ row }) => {
      const data = row.original;
      const sexLabel = data.sex === 1 ? "L" : "P";
      const addrLabel = data.address === 1 ? "Urban" : "Rural";
      const pstatusLabel = data.pstatus === 1 ? "T" : "A";
      
      return (
        <div className="flex flex-col gap-1 text-[11px]">
          <span>Sex: <span className="font-medium">{sexLabel}</span></span>
          <span>Addr: <span className="font-medium">{addrLabel}</span></span>
          <span>PStatus: <span className="font-medium">{pstatusLabel}</span></span>
        </div>
      );
    },
  },
  {
    id: "akademik",
    header: "Akademik",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-col gap-1 text-[11px]">
          <span>Study: <span className="font-medium">{mapStudyTime(data.studytime)}</span></span>
          <span>Failures: <span className="font-medium">{data.failures}x</span></span>
          <span>Absences: <span className="font-medium">{data.absences} Hari</span></span>
        </div>
      );
    },
  },
  {
    id: "sosial",
    header: "Sosial & Waktu Luang",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-col gap-1 text-[11px] min-w-[140px]">
          <span className="truncate">FamRel: <span className="font-medium">{mapFamRel(data.famrel)}</span></span>
          <span className="truncate">FreeTime: <span className="font-medium">{mapFreeTime(data.freetime)}</span></span>
          <span className="truncate">GoOut: <span className="font-medium">{mapGoOut(data.goout)}</span></span>
          <span>Romantic: <span className="font-medium">{data.romantic === 1 ? "Ya" : "Tidak"}</span></span>
        </div>
      );
    },
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