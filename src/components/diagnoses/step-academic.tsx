import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "@/app/(main)/page";

interface StepAcademicProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

export function StepAcademic({ formData, updateFormData }: StepAcademicProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Data Akademik</CardTitle>
        <CardDescription>Informasi terkait studi dan sekolah.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Waktu Belajar per Minggu (Studytime)</Label>
          <Select value={formData.studytime} onValueChange={(v) => updateFormData("studytime", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih waktu belajar" />
            </SelectTrigger>
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
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih jumlah" />
            </SelectTrigger>
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
          <Input
            type="number"
            min="0"
            placeholder="Contoh: 4"
            value={formData.absences}
            onChange={(e) => updateFormData("absences", e.target.value)}
            className="w-full"
          />
        </div>
      </CardContent>
    </>
  );
}