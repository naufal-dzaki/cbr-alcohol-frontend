import { cookies } from "next/headers";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns, EvaluationData } from "./columns";
import { EvaluationHeader } from "./evaluation-header";

async function getEvaluations(): Promise<EvaluationData[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/evaluations", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function EvaluationsPage() {
  const data = await getEvaluations();

  return (
    <div className="space-y-6">
      <EvaluationHeader />

      <div className="bg-white rounded-md p-4 shadow-sm border">
        {data.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Belum ada data evaluasi. Silakan klik tombol "Jalankan Evaluasi Ulang" di atas.
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={data} 
            globalSearchPlaceholder="Cari berdasarkan nilai K atau rasio..."
          />
        )}
      </div>
    </div>
  );
}