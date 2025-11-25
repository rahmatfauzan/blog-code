import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - CodeBox",
  description: "Masuk ke akun CodeBox Anda",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <AuthCard
        title="Login ke CodeBox"
        subtitle="Masukkan email dan password Anda untuk melanjutkan coding."
        backButtonLabel="Daftar sekarang"
        backButtonHref="/register"
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
