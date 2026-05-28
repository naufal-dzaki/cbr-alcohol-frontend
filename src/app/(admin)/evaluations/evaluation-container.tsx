"use client";

import { useState, useMemo } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EvaluationTable } from "./evaluation-table";
import { GroupedEvaluation, EvaluationScenario } from "./columns";

export function EvaluationContainer({ data }: { data: GroupedEvaluation[] }) {
  const [sortBy, setSortBy] = useState<keyof EvaluationScenario | "k_value">("k_value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedData = useMemo(() => {
    if (!data) return [];
    
    const dataCopy = [...data];

    return dataCopy.sort((a, b) => {
      if (sortBy === "k_value") {
        return sortOrder === "asc" ? a.k_value - b.k_value : b.k_value - a.k_value;
      }

      const sumA = a.scenarios.reduce((acc, curr) => acc + (curr[sortBy] as number), 0);
      const avgA = sumA / a.scenarios.length;

      const sumB = b.scenarios.reduce((acc, curr) => acc + (curr[sortBy] as number), 0);
      const avgB = sumB / b.scenarios.length;

      return sortOrder === "asc" ? avgA - avgB : avgB - avgA;
    });
  }, [data, sortBy, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 bg-white p-3 rounded-md border shadow-sm">
        <span className="text-sm font-medium text-muted-foreground">
          Urutkan berdasarkan:
        </span>
        
        <Select 
          value={sortBy} 
          onValueChange={(value) => setSortBy(value as any)}
        >
          <SelectTrigger className="w-[200px] bg-slate-50">
            <SelectValue placeholder="Pilih kriteria..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="k_value">Nilai K (Default)</SelectItem>
            <SelectItem value="accuracy">Rata-rata Akurasi</SelectItem>
            <SelectItem value="precision">Rata-rata Precision</SelectItem>
            <SelectItem value="recall">Rata-rata Recall</SelectItem>
            <SelectItem value="f1_score">Rata-rata F1-Score</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon"
          title={sortOrder === "desc" ? "Tertinggi ke Terendah" : "Terendah ke Tertinggi"}
          onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
        >
          {sortOrder === "desc" ? (
            <ArrowDownWideNarrow className="h-4 w-4" />
          ) : (
            <ArrowUpNarrowWide className="h-4 w-4" />
          )}
        </Button>
      </div>

      <EvaluationTable data={sortedData} />
    </div>
  );
}