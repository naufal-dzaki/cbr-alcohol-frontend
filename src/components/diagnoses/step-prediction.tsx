import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepPredictionProps {
  result: any; 
}

export function StepPrediction({ result }: StepPredictionProps) {
  if (!result) return null;

  const label = result.predicted_label;
  const isBahaya = label === "Bahaya";
  const isWaspada = label === "Waspada";

  return (
    <>
      <CardHeader>
        <CardTitle>Hasil Prediksi</CardTitle>
        <CardDescription>Hasil klasifikasi konsumsi alkohol berdasarkan data yang diberikan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={cn(
            "rounded-2xl p-6 text-white text-center",
            isBahaya ? "bg-red-600" : isWaspada ? "bg-amber-500" : "bg-green-600"
          )}
        >
          <div className="flex justify-center mb-4">
            {isBahaya || isWaspada ? (
              <AlertTriangle className="h-12 w-12" />
            ) : (
              <ShieldCheck className="h-12 w-12" />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2">Status: {label}</h2>
          <p className="text-sm opacity-90">
            Berdasarkan metode Case-Based Reasoning dengan nilai K = {result.k_used}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-2">Detail Similarity</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tingkat kecocokan tertinggi:
            <span className="font-semibold text-blue-600 ml-1">
              {(result.max_similarity * 100).toFixed(2)}%
            </span>
          </p>

          <div className="space-y-3">
            {result.neighbors?.map((n: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-xl bg-slate-50">
                <div>
                  <p className="font-semibold text-sm">Kasus Lama (ID: {n.case_base_id})</p>
                  <p className="text-xs text-muted-foreground">Label: {n.label}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    {(n.similarity * 100).toFixed(2)}%
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Similarity</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </>
  );
}