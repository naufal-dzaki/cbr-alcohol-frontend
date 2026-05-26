import { cookies } from "next/headers";
import { CaseBaseTableWrapper } from "./case-base-table-wrapper";
import { Blocks } from "lucide-react";

async function getCaseBases() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/case-bases?limit=1000&offset=0", {
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

export default async function CaseBasePage() {
  const cases = await getCaseBases();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Blocks className="h-8 w-8" /> Knowledge Base
          </h1>
          <p className="text-muted-foreground mt-1">
            Manajemen data latih dari Dataset Asli, hasil SMOTE, maupun kasus yang telah di-retain.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-md p-4 shadow-sm border">
        <CaseBaseTableWrapper data={cases} />
      </div>
    </div>
  );
}