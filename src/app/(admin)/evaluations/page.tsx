import { cookies } from "next/headers";
import { GroupedEvaluation } from "./columns"; // Pastikan tipe data diekspor dari file yang benar
import { EvaluationHeader } from "./evaluation-header";
import { EvaluationTable } from "./evaluation-table"; // Import komponen baru

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
      
      <EvaluationTable data={data} />
      
    </div>
  );
}