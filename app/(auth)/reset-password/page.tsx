import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - CodeBox",
  description: "Buat password baru untuk akun CodeBox Anda",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 px-4 py-12">
      <AuthCard
        title="Reset Password"
        subtitle="Buat password baru untuk akun Anda. Pastikan berbeda dari sebelumnya."
        showFooter={false}
      >
        <ResetPasswordForm />
      </AuthCard>
    </div>
  );
}
