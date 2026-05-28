"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EvaluationActionCell } from "./evaluation-action-cell";
import { GroupedEvaluation } from "./columns"; 

interface EvaluationTableProps {
  data: GroupedEvaluation[];
}

export function EvaluationTable({ data }: EvaluationTableProps) {
  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[120px] text-center font-bold text-slate-700 border-r">Nilai K</TableHead>
            <TableHead className="font-bold text-slate-700">Rasio (Train:Test)</TableHead>
            <TableHead className="font-bold text-slate-700">Akurasi</TableHead>
            <TableHead className="font-bold text-slate-700">Precision</TableHead>
            <TableHead className="font-bold text-slate-700">Recall</TableHead>
            <TableHead className="font-bold text-slate-700 border-r">F1-Score</TableHead>
            <TableHead className="w-[150px] font-bold text-slate-700 text-center border-r">Status</TableHead>
            <TableHead className="w-[200px] font-bold text-slate-700 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                Belum ada data evaluasi. Silakan jalankan evaluasi ulang.
              </TableCell>
            </TableRow>
          ) : (
            data.map((group) => (
              <React.Fragment key={group.k_value}>
                {group.scenarios.map((scenario, index) => (
                  <TableRow 
                    key={scenario.evaluation_id}
                    className={group.is_active ? "bg-green-50/20" : ""}
                  >
                    
                    {index === 0 && (
                      <TableCell 
                        rowSpan={group.scenarios.length} 
                        className="border-r border-b text-center align-middle bg-slate-50/50"
                      >
                        <span className="font-bold text-2xl block">K = {group.k_value}</span>
                      </TableCell>
                    )}

                    <TableCell>
                      <Badge variant="outline" className="bg-white">{scenario.split_ratio}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">{scenario.accuracy}%</TableCell>
                    <TableCell>{scenario.precision}%</TableCell>
                    <TableCell>{scenario.recall}%</TableCell>
                    <TableCell className="border-r">{scenario.f1_score}%</TableCell>
                    
                    {index === 0 && (
                      <TableCell 
                        rowSpan={group.scenarios.length} 
                        className="border-r border-b text-center align-middle"
                      >
                        <Badge 
                          variant={group.is_active ? "default" : "secondary"} 
                          className={group.is_active ? "bg-blue-600" : ""}
                        >
                          {group.is_active ? "Model Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                    )}

                    {index === 0 && (
                      <TableCell 
                        rowSpan={group.scenarios.length} 
                        className="border-b text-center align-middle"
                      >
                        <EvaluationActionCell 
                          k_value={group.k_value} 
                          is_active={group.is_active} 
                        />
                      </TableCell>
                    )}
                    
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}