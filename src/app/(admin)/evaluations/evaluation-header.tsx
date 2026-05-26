"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EvaluationHeader() {
  const router = useRouter();
  const [isEvaluating, setIsEvaluating] = useState(false);

  const runEvaluation = async () => {
    setIsEvaluating(true);
    const token = Cookies.get("access_token");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/evaluations/run", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Gagal: ${errorData.detail}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem saat evaluasi.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluasi Model (Dynamic K)</h1>
        <p className="text-muted-foreground mt-1">
          Uji performa algoritma KNN & Cosine Similarity menggunakan berbagai skenario rasio data dan nilai K.
        </p>
      </div>
      <Button onClick={runEvaluation} disabled={isEvaluating} className="bg-blue-600 hover:bg-blue-700">
        {isEvaluating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menjalankan Testing...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Jalankan Evaluasi Ulang
          </>
        )}
      </Button>
    </div>
  );
}