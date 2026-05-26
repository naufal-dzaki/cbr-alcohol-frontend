"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
  { id: "demographics", title: "Profil Dasar" },
  { id: "academic", title: "Data Akademik" },
  { id: "social", title: "Kehidupan Sosial" },
];

interface FormData {
  sex: string;
  address: string;
  pstatus: string;
  romantic: string;
  famrel: string;
  studytime: string;
  failures: string;
  absences: string;
  freetime: string;
  goout: string;
}

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export default function PublicDiagnosisPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null); 

  const [formData, setFormData] = useState<FormData>({
    sex: "", address: "", pstatus: "", romantic: "",
    famrel: "", studytime: "", failures: "", absences: "", freetime: "", goout: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.sex !== "" && formData.address !== "" && formData.pstatus !== "";
      case 1: return formData.studytime !== "" && formData.failures !== "" && formData.absences !== "";
      case 2: return formData.famrel !== "" && formData.freetime !== "" && formData.goout !== "" && formData.romantic !== "";
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const payload = {
      ...formData,
      famrel: parseFloat(formData.famrel),
      studytime: parseFloat(formData.studytime),
      failures: parseFloat(formData.failures),
      absences: parseFloat(formData.absences),
      freetime: parseFloat(formData.freetime),
      goout: parseFloat(formData.goout),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Gagal melakukan simulasi");
      
      toast.success("Diagnosis berhasil diselesaikan!");
      setResult(data.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    const label = result.predicted_label;
    const isBahaya = label === "Bahaya";
    const isWaspada = label === "Waspada";

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <Card className="border shadow-xl rounded-3xl overflow-hidden">
            <div className={cn("p-8 text-center text-white", isBahaya ? "bg-red-600" : isWaspada ? "bg-yellow-500" : "bg-green-600")}>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 mb-4">
                {isBahaya ? <AlertTriangle className="h-10 w-10" /> : <ShieldCheck className="h-10 w-10" />}
              </div>
              <h2 className="text-3xl font-bold mb-2">Status: {label}</h2>
              <p className="opacity-90">Berdasarkan hasil Case-Based Reasoning dengan nilai K = {result.k_used}</p>
            </div>
            
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Detail Similarity (Alasan Prediksi)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sistem kami menemukan kasus serupa di masa lalu dengan profil yang hampir identik dengan Anda:
              </p>
              
              <div className="space-y-3">
                {result.neighbors.map((n: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                        #{n.rank}
                      </div>
                      <div>
                        <p className="text-sm font-medium">Data Kasus (ID: {n.case_base_id})</p>
                        <p className="text-xs text-muted-foreground">Label Aktual: {n.label}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{(n.similarity * 100).toFixed(2)}%</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Tingkat Kemiripan</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 p-6">
              <Button className="w-full rounded-xl" onClick={() => setResult(null)}>
                Lakukan Simulasi Ulang
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Simulasi Prediksi Konsumsi Alkohol</h1>
        <p className="mt-2 text-muted-foreground">Jawab pertanyaan berikut secara jujur untuk mendapatkan hasil klasifikasi</p>
      </div>

      <div className="w-full max-w-xl">
        <div className="mb-8">
          <div className="flex justify-between mb-2 px-2">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={cn("w-4 h-4 rounded-full transition-colors duration-300",
                  index < currentStep ? "bg-blue-600" : index === currentStep ? "bg-blue-600 ring-4 ring-blue-600/20" : "bg-gray-200"
                )} />
                <span className={cn("text-xs mt-2 font-medium hidden sm:block", index === currentStep ? "text-blue-600" : "text-gray-400")}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Card className="border shadow-lg rounded-3xl overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial="hidden" animate="visible" exit="exit" variants={contentVariants}>
              
              {currentStep === 0 && (
                <>
                  <CardHeader><CardTitle>{steps[0].title}</CardTitle><CardDescription>Informasi dasar mengenai demografi Anda.</CardDescription></CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-3">
                      <Label>Jenis Kelamin (Sex)</Label>
                      <RadioGroup value={formData.sex} onValueChange={(v) => updateFormData("sex", v)} className="flex gap-4">
                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50"><RadioGroupItem value="M" id="M" /><Label htmlFor="M" className="cursor-pointer">Laki-laki</Label></div>
                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50"><RadioGroupItem value="F" id="F" /><Label htmlFor="F" className="cursor-pointer">Perempuan</Label></div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-3">
                      <Label>Tempat Tinggal (Address)</Label>
                      <RadioGroup value={formData.address} onValueChange={(v) => updateFormData("address", v)} className="flex gap-4">
                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1"><RadioGroupItem value="U" id="U" /><Label htmlFor="U">Perkotaan (Urban)</Label></div>
                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1"><RadioGroupItem value="R" id="R" /><Label htmlFor="R">Pedesaan (Rural)</Label></div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-3">
                      <Label>Status Orang Tua (Pstatus)</Label>
                      <RadioGroup value={formData.pstatus} onValueChange={(v) => updateFormData("pstatus", v)} className="flex gap-4">
                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1"><RadioGroupItem value="T" id="T" /><Label htmlFor="T">Tinggal Bersama</Label></div>
                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1"><RadioGroupItem value="A" id="A" /><Label htmlFor="A">Berpisah (Apart)</Label></div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <CardHeader><CardTitle>{steps[1].title}</CardTitle><CardDescription>Informasi terkait studi dan sekolah.</CardDescription></CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label>Waktu Belajar per Minggu (Studytime)</Label>
                      <Select value={formData.studytime} onValueChange={(v) => updateFormData("studytime", v)}>
                        <SelectTrigger><SelectValue placeholder="Pilih waktu belajar" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">&lt; 2 Jam</SelectItem>
                          <SelectItem value="2">2 - 5 Jam</SelectItem>
                          <SelectItem value="3">5 - 10 Jam</SelectItem>
                          <SelectItem value="4">&gt; 10 Jam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Jumlah Kegagalan Kelas Sebelumnya (Failures)</Label>
                      <Select value={formData.failures} onValueChange={(v) => updateFormData("failures", v)}>
                        <SelectTrigger><SelectValue placeholder="Pilih jumlah" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 (Tidak Pernah)</SelectItem>
                          <SelectItem value="1">1 Kali</SelectItem>
                          <SelectItem value="2">2 Kali</SelectItem>
                          <SelectItem value="3">&gt;= 3 Kali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Jumlah Absensi Sekolah (Absences)</Label>
                      <Input type="number" min="0" max="75" placeholder="Contoh: 4" value={formData.absences} onChange={(e) => updateFormData("absences", e.target.value)} />
                      <p className="text-xs text-muted-foreground">Rentang: 0 - 75 hari</p>
                    </div>
                  </CardContent>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <CardHeader><CardTitle>{steps[2].title}</CardTitle><CardDescription>Kehidupan sosial dan waktu luang.</CardDescription></CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label>Kualitas Hubungan Keluarga (Famrel)</Label>
                      <Select value={formData.famrel} onValueChange={(v) => updateFormData("famrel", v)}>
                        <SelectTrigger><SelectValue placeholder="Skala 1 (Sangat Buruk) - 5 (Sangat Baik)" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Sangat Buruk</SelectItem>
                          <SelectItem value="2">2 - Buruk</SelectItem>
                          <SelectItem value="3">3 - Cukup</SelectItem>
                          <SelectItem value="4">4 - Baik</SelectItem>
                          <SelectItem value="5">5 - Sangat Baik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Waktu Luang Sepulang Sekolah (Freetime)</Label>
                      <Select value={formData.freetime} onValueChange={(v) => updateFormData("freetime", v)}>
                        <SelectTrigger><SelectValue placeholder="Skala 1 (Sangat Sedikit) - 5 (Sangat Banyak)" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Sangat Sedikit</SelectItem>
                          <SelectItem value="2">2 - Sedikit</SelectItem>
                          <SelectItem value="3">3 - Sedang</SelectItem>
                          <SelectItem value="4">4 - Banyak</SelectItem>
                          <SelectItem value="5">5 - Sangat Banyak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Frekuensi Keluar Bersama Teman (Goout)</Label>
                      <Select value={formData.goout} onValueChange={(v) => updateFormData("goout", v)}>
                        <SelectTrigger><SelectValue placeholder="Skala 1 (Sangat Jarang) - 5 (Sangat Sering)" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Sangat Jarang</SelectItem>
                          <SelectItem value="2">2 - Jarang</SelectItem>
                          <SelectItem value="3">3 - Kadang-kadang</SelectItem>
                          <SelectItem value="4">4 - Sering</SelectItem>
                          <SelectItem value="5">5 - Sangat Sering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label>Apakah memiliki hubungan romantis? (Romantic)</Label>
                      <RadioGroup value={formData.romantic} onValueChange={(v) => updateFormData("romantic", v)} className="flex gap-4">
                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1"><RadioGroupItem value="yes" id="yes" /><Label htmlFor="yes">Ya</Label></div>
                        <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1"><RadioGroupItem value="no" id="no" /><Label htmlFor="no">Tidak</Label></div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </>
              )}

            </motion.div>
          </AnimatePresence>

          <CardFooter className="flex justify-between p-6 bg-gray-50/50 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="rounded-xl">
              <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
            </Button>
            <Button onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep} disabled={!isStepValid() || isSubmitting} className="rounded-xl bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : currentStep === steps.length - 1 ? (
                <><Activity className="mr-2 h-4 w-4" /> Lihat Prediksi</>
              ) : (
                <>Selanjutnya <ChevronRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}