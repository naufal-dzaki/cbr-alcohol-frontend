import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@/app/(main)/page";

interface StepSocialProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

export function StepSocial({ formData, updateFormData }: StepSocialProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Kehidupan Sosial</CardTitle>
        <CardDescription>Kehidupan sosial dan waktu luang.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* FAMREL */}
        <div className="space-y-2">
          <Label>Kualitas Hubungan Keluarga (Famrel)</Label>
          <Select value={formData.famrel} onValueChange={(v) => updateFormData("famrel", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Skala 1 - 5" />
            </SelectTrigger>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Skala 1 - 5" />
            </SelectTrigger>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Skala 1 - 5" />
            </SelectTrigger>
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
          <Label>Apakah memiliki hubungan romantis?</Label>
          <RadioGroup
            value={formData.romantic}
            onValueChange={(v) => updateFormData("romantic", v)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="yes" id="yes" className="cursor-pointer" />
              <Label htmlFor="yes" className="flex-1 cursor-pointer font-medium">Ya</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="no" id="no" className="cursor-pointer" />
              <Label htmlFor="no" className="flex-1 cursor-pointer font-medium">Tidak</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </>
  );
}