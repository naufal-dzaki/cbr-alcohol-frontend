import { cookies } from "next/headers";
import { DiagnosisTableWrapper } from "./diagnosis-table-wrapper";
import { MessagesSquare } from "lucide-react";

async function getDiagnoses() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/diagnoses", {
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

export default async function DiagnosesQueuePage() {
  const diagnoses = await getDiagnoses();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessagesSquare className="h-8 w-8" /> Antrean Diagnosis (Validasi Pakar)
          </h1>
          <p className="text-muted-foreground mt-1">
            Tinjau kasus baru dari simulasi publik. Setujui atau revisi untuk memperkaya Knowledge Base secara otomatis (Retain).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 shadow-sm border">
        <DiagnosisTableWrapper data={diagnoses} />
      </div>
    </div>
  );
}