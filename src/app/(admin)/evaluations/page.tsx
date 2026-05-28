import { cookies } from "next/headers";
import { GroupedEvaluation } from "./columns"; 
import { EvaluationHeader } from "./evaluation-header";
import { EvaluationContainer } from "./evaluation-container"; 

async function getEvaluations(): Promise<GroupedEvaluation[]> {
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
      
      {data.length === 0 ? (
        <div className="bg-white rounded-md p-4 shadow-sm border text-center py-10 text-muted-foreground">
          Belum ada data evaluasi. Silakan klik tombol "Jalankan Evaluasi Ulang" di atas.
        </div>
      ) : (
        <EvaluationContainer data={data} />
      )}
    </div>
  );
}