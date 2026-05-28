import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@/app/(main)/page";

interface StepDemographicsProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

export function StepDemographics({ formData, updateFormData }: StepDemographicsProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Profil Dasar</CardTitle>
        <CardDescription>Informasi dasar mengenai demografi Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <Label>Jenis Kelamin (Sex)</Label>
          <RadioGroup
            value={formData.sex}
            onValueChange={(v) => updateFormData("sex", v)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="M" id="M" className="cursor-pointer" />
              <Label htmlFor="M" className="flex-1 cursor-pointer font-medium">Laki-laki</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="F" id="F" className="cursor-pointer" />
              <Label htmlFor="F" className="flex-1 cursor-pointer font-medium">Perempuan</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Tempat Tinggal (Address)</Label>
          <RadioGroup
            value={formData.address}
            onValueChange={(v) => updateFormData("address", v)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="U" id="U" className="cursor-pointer" />
              <Label htmlFor="U" className="flex-1 cursor-pointer font-medium">Perkotaan (Urban)</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="R" id="R" className="cursor-pointer" />
              <Label htmlFor="R" className="flex-1 cursor-pointer font-medium">Pedesaan (Rural)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Status Orang Tua (Pstatus)</Label>
          <RadioGroup
            value={formData.pstatus}
            onValueChange={(v) => updateFormData("pstatus", v)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="T" id="T" className="cursor-pointer" />
              <Label htmlFor="T" className="flex-1 cursor-pointer font-medium">Tinggal Bersama</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
              <RadioGroupItem value="A" id="A" className="cursor-pointer" />
              <Label htmlFor="A" className="flex-1 cursor-pointer font-medium">Berpisah (Apart)</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </>
  );
}