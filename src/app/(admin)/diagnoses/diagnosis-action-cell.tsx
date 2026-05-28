"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Eye, CheckCircle, Edit3, XCircle, User, BookOpen, AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { DiagnosisData } from "./columns";

export function DiagnosisActionCell({ diagnosis }: { diagnosis: DiagnosisData }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<"APPROVE" | "REVISE" | "REJECT" | "">("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!actionType) return toast.error("Pilih tindakan validasi terlebih dahulu");
    if (actionType === "REVISE" && !newLabel) return toast.error("Pilih label baru untuk direvisi");

    setIsSubmitting(true);
    const token = Cookies.get("access_token");

    const payload: Record<string, any> = {
      action: actionType,
    };

    if (actionType === "REVISE") {
      payload.new_label = newLabel;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/diagnoses/${diagnosis.id}/revise`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Terjadi kesalahan pada server");

      toast.success(data.message);
      setIsOpen(false);
      router.refresh(); 
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const decodeFeatures = {
    sex: diagnosis.sex === 1 ? "Laki-laki" : "Perempuan",
    address: diagnosis.address === 1 ? "Perkotaan (Urban)" : "Pedesaan (Rural)",
    pstatus: diagnosis.pstatus === 1 ? "Pisah Rumah" : "Tinggal Bersama",
    romantic: diagnosis.romantic === 1 ? "Ya" : "Tidak",
    famrel: diagnosis.famrel,
    studytime: diagnosis.studytime,
    failures: diagnosis.failures,
    absences: diagnosis.absences,
    freetime: diagnosis.freetime,
    goout: diagnosis.goout,
  };

  if (diagnosis.status !== "PENDING") {
    return (
      <Button variant="ghost" disabled className="text-xs h-8">
        Selesai
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 hover:border-blue-500 hover:text-blue-600">
          <Eye className="mr-2 h-4 w-4" /> Tinjau
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validasi Pakar (Revise & Retain)</DialogTitle>
          <DialogDescription>
            Sistem memprediksi kelas <strong className="text-destructive">{diagnosis.predicted_label}</strong> dengan tingkat kemiripan <span className="font-semibold text-blue-600">{(diagnosis.max_similarity * 100).toFixed(2)}%</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-50 p-4 rounded-lg border text-xs space-y-3 my-2">
          <h3 className="font-semibold text-sm text-slate-700 flex items-center gap-1.5">
            <User className="h-4 w-4 text-slate-500" /> Parameter Kondisi Pengguna
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <div className="space-y-1">
              <span className="text-muted-foreground block">Jenis Kelamin:</span>
              <span className="font-medium">{decodeFeatures.sex}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Tempat Tinggal:</span>
              <span className="font-medium">{decodeFeatures.address}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Status Tinggal Orang Tua:</span>
              <span className="font-medium">{decodeFeatures.pstatus}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Hubungan Romantis:</span>
              <span className="font-medium">{decodeFeatures.romantic}</span>
            </div>

            <div className="col-span-2 py-0.5">
              <Separator />
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground block flex items-center gap-1">
                <BookOpen className="h-3 w-3" /> Waktu Belajar (Skala 1-4):
              </span>
              <span className="font-medium">{decodeFeatures.studytime}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Jumlah Gagal Kelas:
              </span>
              <span className="font-medium">{decodeFeatures.failures}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Jumlah Absensi (Sakit/Alpa):</span>
              <span className="font-medium">{decodeFeatures.absences} Hari</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block flex items-center gap-1">
                <Home className="h-3 w-3" /> Hubungan Keluarga (Skala 1-5):
              </span>
              <span className="font-medium">{decodeFeatures.famrel}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Waktu Luang (Skala 1-5):</span>
              <span className="font-medium">{decodeFeatures.freetime}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Intensitas Keluar Rumah (Skala 1-5):</span>
              <span className="font-medium">{decodeFeatures.goout}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label className="text-sm font-semibold">Tindakan Validasi</Label>
            <div className="flex flex-col gap-2">
              <Button 
                variant={actionType === "APPROVE" ? "default" : "outline"} 
                className={actionType === "APPROVE" ? "bg-green-600 hover:bg-green-700" : "justify-start"}
                onClick={() => setActionType("APPROVE")}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Setujui (Approve) & Masukkan ke Case Base
              </Button>
              <Button 
                variant={actionType === "REVISE" ? "default" : "outline"}
                className={actionType === "REVISE" ? "bg-blue-600 hover:bg-blue-700" : "justify-start"}
                onClick={() => setActionType("REVISE")}
              >
                <Edit3 className="mr-2 h-4 w-4" /> Revisi Hasil Diagnosis & Retain
              </Button>
              <Button 
                variant={actionType === "REJECT" ? "default" : "outline"}
                className={actionType === "REJECT" ? "bg-red-600 hover:bg-red-700" : "justify-start"}
                onClick={() => setActionType("REJECT")}
              >
                <XCircle className="mr-2 h-4 w-4" /> Tolak Kasus (Reject)
              </Button>
            </div>
          </div>

          {actionType === "REVISE" && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
              <Label className="text-sm font-medium">Label Klasifikasi Baru Koreksi Pakar</Label>
              <Select value={newLabel} onValueChange={setNewLabel}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih label koreksi..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Waspada">Waspada</SelectItem>
                  <SelectItem value="Bahaya">Bahaya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Batal</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !actionType}>
            {isSubmitting ? "Memproses..." : "Konfirmasi Tindakan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}