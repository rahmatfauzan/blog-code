"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Sparkles, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AIMetaGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const form = useFormContext(); // Access form dari parent

  const generateMetaWithAI = async () => {
    const title = form.getValues("title");
    const content = form.getValues("content");

    // ✅ Validation
    if (!title || !content) {
      toast.error("Isi judul dan konten terlebih dahulu");
      return;
    }

    if (title.length < 5) {
      toast.error("Judul terlalu pendek (minimal 5 karakter)");
      return;
    }

    if (content.length < 50) {
      toast.error("Konten terlalu pendek (minimal 50 karakter)");
      return;
    }

    setIsGenerating(true);
    setStatus("idle");

    try {
      // ✅ Call API
      const response = await fetch("/api/generate-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: content.substring(0, 1000), // Kirim 1000 char pertama
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal generate meta");
      }

      // ✅ FIX: Akses result.data (bukan result langsung)
      const { data } = result;

      if (!data || !data.meta_title || !data.meta_description) {
        throw new Error("Response tidak lengkap dari AI");
      }

      // ✅ Populate form dengan hasil AI
      form.setValue("meta_title", data.meta_title);
      form.setValue("meta_description", data.meta_description);
      form.setValue("meta_keywords", data.meta_keywords || []);

      setStatus("success");
      toast.success("✨ Meta berhasil di-generate dengan AI!", {
        description: "Anda bisa edit hasilnya sebelum menyimpan.",
      });

      // Auto-scroll ke meta fields (optional)
      setTimeout(() => {
        const metaTitleField = document.querySelector(
          'input[name="meta_title"]'
        );
        if (metaTitleField) {
          metaTitleField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      setStatus("error");
      toast.error(error.message || "Gagal generate meta dengan AI", {
        description: "Silakan coba lagi atau isi manual.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={generateMetaWithAI}
        disabled={isGenerating}
        className="gap-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Generating...</span>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Generate Ulang</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span>✨ Generate dengan AI</span>
          </>
        )}
      </Button>

      {/* ✅ Status Messages (Optional - bisa dihapus jika tidak perlu) */}
      {status === "success" && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-sm text-green-800 dark:text-green-300">
            Meta berhasil di-generate! Scroll ke bawah untuk melihat hasilnya.
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-sm text-red-800 dark:text-red-300">
            Gagal generate. Silakan coba lagi atau isi manual.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
