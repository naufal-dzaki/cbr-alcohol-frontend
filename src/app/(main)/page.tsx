"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Activity, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { StepDemographics } from "@/components/diagnoses/step-demographics";
import { StepAcademic } from "@/components/diagnoses/step-academic";
import { StepSocial } from "@/components/diagnoses/step-social";
import { StepPrediction } from "@/components/diagnoses/step-prediction";

export interface FormData {
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

const steps = [
  { id: "demographics", title: "Profil Dasar" },
  { id: "academic", title: "Data Akademik" },
  { id: "social", title: "Kehidupan Sosial" },
  { id: "prediction", title: "Hasil Prediksi" },
];

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
    sex: "", address: "", pstatus: "", romantic: "", famrel: "",
    studytime: "", failures: "", absences: "", freetime: "", goout: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0 && currentStep !== 3) setCurrentStep((prev) => prev - 1);
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

      setResult(data.data);
      setCurrentStep(3);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSimulation = () => {
    setResult(null);
    setCurrentStep(0);
    setFormData({
      sex: "", address: "", pstatus: "", romantic: "", famrel: "",
      studytime: "", failures: "", absences: "", freetime: "", goout: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Simulasi Prediksi Konsumsi Alkohol</h1>
        <p className="mt-2 text-muted-foreground">Jawab pertanyaan berikut secara jujur untuk mendapatkan hasil klasifikasi</p>
      </div>

      <div className="w-full max-w-xl">
        <div className="mb-8">
          <div className="flex justify-between mb-2 px-2">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full transition-colors duration-300",
                    index < currentStep ? "bg-blue-600" : index === currentStep ? "bg-blue-600 ring-4 ring-blue-600/20" : "bg-gray-200"
                  )}
                />
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
              {currentStep === 0 && <StepDemographics formData={formData} updateFormData={updateFormData} />}
              {currentStep === 1 && <StepAcademic formData={formData} updateFormData={updateFormData} />}
              {currentStep === 2 && <StepSocial formData={formData} updateFormData={updateFormData} />}
              {currentStep === 3 && result && <StepPrediction result={result} />}
            </motion.div>
          </AnimatePresence>

          <CardFooter className="flex justify-between p-6 bg-gray-50/50 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || currentStep === 3}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>

            <Button
              onClick={currentStep === 2 ? handleSubmit : currentStep === 3 ? resetSimulation : nextStep}
              disabled={(currentStep !== 3 && !isStepValid()) || isSubmitting}
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
              ) : currentStep === 2 ? (
                <><Activity className="mr-2 h-4 w-4" /> Lihat Prediksi</>
              ) : currentStep === 3 ? (
                <><CheckCircle className="mr-2 h-4 w-4" /> Simulasi Ulang</>
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