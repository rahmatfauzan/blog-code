"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";

export default function VerifySuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Logic Countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect otomatis saat waktu habis
      router.push("/dashboard");
    }
  }, [countdown, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <AuthCard
        title="Email Terverifikasi!"
        subtitle="Akun Anda telah aktif sepenuhnya."
        showFooter={false}
      >
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
          {/* Icon Sukses Besar */}
          <div className="mx-auto w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-75" />
            <CheckCircle className="h-12 w-12 text-green-600 relative z-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Selamat Datang di CodeBox! 🎉
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 px-4">
              Email Anda berhasil diverifikasi. Anda siap untuk mulai
              mendokumentasikan kode Anda.
            </p>
          </div>

          {/* Info Box: Next Steps */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-5 text-left space-y-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-600" /> Apa selanjutnya?
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                <span>Lengkapi profil developer Anda</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                <span>Buat dokumentasi pertama Anda</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                <span>Jelajahi snippet komunitas</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="space-y-4 pt-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02]"
              size="lg"
            >
              Masuk ke Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Mengalihkan otomatis dalam {countdown} detik...</span>
            </div>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
