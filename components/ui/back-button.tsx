"use client"; // Wajib ada

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="gap-2 pl-0 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
      onClick={() => router.back()} // Fungsi ini butuh client side
    >
      <ArrowLeft className="h-4 w-4" /> Kembali
    </Button>
  );
}