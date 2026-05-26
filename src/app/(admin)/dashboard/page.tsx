import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileCheck, RefreshCw, Activity, AlertTriangle } from "lucide-react";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", 
    });

    if (!res.ok) throw new Error("Gagal mengambil data dashboard");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">Gagal memuat data dari server backend.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Analytics</h1>
        <p className="text-muted-foreground">
          Ringkasan performa sistem Case-Based Reasoning dan Knowledge Base.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Case Base</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_case_base}</div>
            <p className="text-xs text-muted-foreground">Data gabungan (Asli + SMOTE)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Diagnoses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_diagnoses}</div>
            <p className="text-xs text-muted-foreground">Simulasi publik dilakukan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retained Cases</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.retained_cases}</div>
            <p className="text-xs text-muted-foreground">Kasus baru disimpan ke basis data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pakar Revises</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_revises}</div>
            <p className="text-xs text-muted-foreground">Koreksi label oleh admin</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Label (Knowledge Base)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.label_distribution).map(([label, count]: any) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-medium text-sm">{label}</span>
                  <span className="text-sm text-muted-foreground">{count} data</span>
                </div>
              ))}
              {Object.keys(data.label_distribution).length === 0 && (
                <p className="text-sm text-muted-foreground italic">Belum ada data.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {data.active_evaluation.k_value ? (
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Nilai K</span>
                  <span className="font-bold">K = {data.active_evaluation.k_value}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Split Ratio</span>
                  <span className="font-bold">{data.active_evaluation.split_ratio}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <span className="font-bold text-green-600">{data.active_evaluation.accuracy}%</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-muted-foreground">F1-Score</span>
                  <span className="font-bold">{data.active_evaluation.f1_score}%</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-2 text-orange-500 py-6">
                <AlertTriangle className="h-8 w-8" />
                <p className="text-sm text-center">Belum ada evaluasi model yang diaktifkan. Silakan jalankan Evaluasi K terlebih dahulu.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}