"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Mail,
  Lock,
  Github,
  Loader2,
  Eye,
  EyeOff,
  Chrome, // Icon untuk Google
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import Schema & Actions
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { login, loginWithGithub, loginWithGoogle } from "@/lib/actions/auth";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition(); // Untuk handle loading OAuth

  // Setup React Hook Form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 1. Handle Login Email/Password
  const onSubmit = async (data: LoginValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await login(formData);

      if (result?.error) {
        toast.error("Login Gagal", {
          description: result.error,
        });
      }
      // Jika sukses, redirect otomatis terjadi di server action
    } catch (err) {
      toast.error("Terjadi Kesalahan", {
        description: "Silakan coba lagi nanti.",
      });
    }
  };

  // 2. Handle Login OAuth (Google/GitHub)
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
            <p className="text-xs text-red-500 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-purple-600 transition-colors"
            >
              Lupa Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
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
            <p className="text-xs text-red-500 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button (Gradient) */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Masuk ke Console"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center text-xs">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
          atau lanjutkan dengan
        </div>
      </div>

      {/* Social Buttons (Grid 2 Kolom) */}
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
