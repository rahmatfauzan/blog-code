"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RotateCw } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";

function VerifyErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Mapping pesan error agar lebih user friendly
  let title = "Verifikasi Gagal";
  let message = "Terjadi kesalahan saat memverifikasi email Anda.";

  // Supabase biasanya mengirim error_code atau error_description
  if (error === 'invalid_token' || error?.includes("expired")) {
    title = "Link Kadaluarsa";
    message = "Link verifikasi ini sudah tidak valid atau sudah digunakan sebelumnya.";
  }

  return (
    <AuthCard
      title={title}
      subtitle="Kami mengalami kendala memproses permintaan Anda."
      showFooter={false}
    >
      <div className="text-center space-y-6">
        {/* Icon Error */}
        <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center animate-in zoom-in">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 px-4 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Solusi */}
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-left text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <p className="font-semibold text-slate-900 dark:text-slate-200">Apa yang harus dilakukan?</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Coba login ulang, mungkin akun sudah aktif.</li>
            <li>Minta kirim ulang email verifikasi.</li>
            <li>Hubungi support jika masalah berlanjut.</li>
          </ul>
        </div>

        {/* Tombol Aksi */}
        <div className="space-y-3 pt-2">
          <Link href="/login" className="block">
            {/* Tombol Gradient Blue-Purple */}
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20">
              <RotateCw className="mr-2 h-4 w-4" /> Coba Login
            </Button>
          </Link>
          
          <Link href="/register" className="block">
             <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800">
               Daftar Ulang
             </Button>
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

export default function VerifyErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyErrorContent />
      </Suspense>
    </div>
  );
}