"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { UploadCloud, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DatasetPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; message: string; data?: any } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    const token = Cookies.get("access_token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/datasets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Terjadi kesalahan saat mengunggah dataset.");
      }

      setResult({ status: "success", message: data.message, data: data.data });
      setFile(null);
      
      const fileInput = document.getElementById('dataset-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      setResult({ status: "error", message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Dataset</h1>
        <p className="text-muted-foreground">
          Unggah dataset (CSV) untuk memicu proses Ekstraksi, Normalisasi (Min-Max), dan Balancing (SMOTE).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inisialisasi Knowledge Base</CardTitle>
          <CardDescription>
            Pastikan dataset memiliki format kolom yang sesuai dengan parameter sistem CBR (Sex, Address, Pstatus, Famrel, dll).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="dataset-file">File Dataset (.csv)</Label>
              <Input 
                id="dataset-file" 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" disabled={!file || isLoading} className="w-[200px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses ML...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload & Proses
                </>
              )}
            </Button>
          </form>

          {result && (
            <div className="mt-6">
              {result.status === "error" ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Gagal</AlertTitle>
                  <AlertDescription>{result.message}</AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Berhasil!</AlertTitle>
                  <AlertDescription>
                    <p>{result.message}</p>
                    <ul className="mt-2 list-inside list-disc text-sm">
                      <li>Total Data Original: {result.data.total_original} baris</li>
                      <li>Total Data Setelah SMOTE: <span className="font-bold">{result.data.total_after_smote} baris</span></li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}