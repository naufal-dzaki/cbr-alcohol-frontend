"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CaseBaseData } from "./columns";

export function CaseBaseActionCell({ caseData }: { caseData: CaseBaseData }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const token = Cookies.get("access_token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/case-bases/${caseData.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setShowDeleteDialog(false);
        router.refresh(); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  const handleEditLabel = async (newLabel: string) => {
    setIsPending(true);
    const token = Cookies.get("access_token");
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/case-bases/${caseData.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ label: newLabel })
      });
      if (res.ok) {
        setShowEditDialog(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Ubah Label (Revise)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-red-600 focus:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" /> Hapus Outlier
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Case Base?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus data latih ini secara permanen. Sangat disarankan jika data ini dianggap sebagai noise/outlier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
              {isPending ? "Menghapus..." : "Hapus Data"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ubah Label Klasifikasi</AlertDialogTitle>
            <AlertDialogDescription>
              Label saat ini: <strong>{caseData.label}</strong>. Pilih label baru di bawah ini:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2 my-4">
            <Button variant="outline" onClick={() => handleEditLabel("Normal")} disabled={isPending} className="hover:bg-green-50 hover:text-green-600">Normal</Button>
            <Button variant="outline" onClick={() => handleEditLabel("Waspada")} disabled={isPending} className="hover:bg-yellow-50 hover:text-yellow-600">Waspada</Button>
            <Button variant="outline" onClick={() => handleEditLabel("Bahaya")} disabled={isPending} className="hover:bg-red-50 hover:text-red-600">Bahaya</Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}