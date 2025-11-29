"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Lock,
  User,
  Github,
  Chrome,
  Loader2,
  CheckCircle2, // Icon tambahan biar cantik kalau cocok
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { registerSchema, type RegisterValues } from "@/lib/validation/auth";
import { signup, loginWithGithub, loginWithGoogle } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch, // Untuk pantau nilai password secara real-time
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Pantau nilai password untuk visual feedback (opsional tapi bagus)
  const passwordValue = watch("password");
  const confirmValue = watch("confirmPassword");
  const isMatching =
    passwordValue && confirmValue && passwordValue === confirmValue;

  const onSubmit = async (data: RegisterValues) => {
    try {
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      const result = await signup(formData);
      if (result?.error) {
        toast.error("Gagal Mendaftar", { description: result.error });
        return;
      }
      if (result?.success) {
        if (result.requireVerify) {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        } else {
          router.push("/dashboard");
        }
        toast.success("Pendaftaran Berhasil!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi Kesalahan Sistem");
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    startTransition(async () => {
      try {
        if (provider === "google") await loginWithGoogle();
        if (provider === "github") await loginWithGithub();
      } catch (error) {
        toast.error(`Gagal login dengan ${provider}`);
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Nama Lengkap</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              id="full_name"
              placeholder="John Doe"
              className={`pl-10 ${
                errors.full_name
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              {...register("full_name")}
              disabled={isLoading}
            />
          </div>
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              id="email"
              type="email"
              placeholder="dev@codebox.com"
              className={`pl-10 ${
                errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              {...register("email")}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password 1 */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              id="password"
              type="password"
              placeholder="Min. 6 karakter"
              className={`pl-10 pr-10 ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              {...register("password")}
              disabled={isLoading}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Password 2 (Konfirmasi) */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              className={`pl-10 pr-10 ${
                errors.confirmPassword
                  ? "border-red-500 focus-visible:ring-red-500"
                  : isMatching
                  ? "border-green-500 focus-visible:ring-green-500"
                  : ""
              }`}
              {...register("confirmPassword")}
              disabled={isLoading}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Indikator Visual Cocok */}
              {isMatching && !errors.confirmPassword && (
                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in zoom-in" />
              )}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.01] mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mendaftarkan...
            </>
          ) : (
            "Buat Akun Baru"
          )}
        </Button>
      </form>

      {/* Social & Divider sama seperti sebelumnya */}
      <div className="relative flex items-center justify-center text-xs">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
          atau daftar dengan
        </div>
      </div>

      <div className="">
        <Button
          variant="outline"
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={isLoading}
          className="w-full h-11 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Chrome className="mr-2 h-4 w-4 text-red-500" /> Google
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
