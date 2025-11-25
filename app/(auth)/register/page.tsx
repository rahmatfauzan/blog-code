import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar - CodeBox",
  description: "Buat akun CodeBox baru",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <AuthCard
        title="Bergabung dengan CodeBox"
        subtitle="Buat akun gratis untuk mulai menyimpan dan berbagi kode snippet Anda."
        backButtonLabel="Login di sini"
        backButtonHref="/login"
      >
        <RegisterForm />
      </AuthCard>
    </div>
  );
}
