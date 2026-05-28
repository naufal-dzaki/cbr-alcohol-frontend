"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EvaluationScenario } from "./columns";

export function EvaluationActionCell({ evaluation }: { evaluation: EvaluationScenario }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSetActive = async () => {
    setIsLoading(true);
    const token = Cookies.get("access_token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/evaluations/${evaluation.evaluation_id}/active`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (evaluation.is_active) {
    return (
      <Button variant="ghost" disabled className="text-green-600 opacity-100">
        <CheckCircle2 className="mr-2 h-4 w-4" /> Sedang Dipakai
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSetActive} 
      disabled={isLoading}
      className="hover:border-blue-500 hover:text-blue-600"
    >
      {isLoading ? "Memproses..." : "Set Active"}
    </Button>
  );
}