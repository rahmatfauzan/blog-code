import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password - CodeBox",
  description: "Reset password akun CodeBox Anda",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 px-4 py-12">
      <AuthCard
        title="Lupa Password?"
        subtitle="Masukkan email Anda dan kami akan mengirim link untuk reset password."
        showFooter={false}
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
}
