"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";

// --- 1. LOGIN EMAIL ---
export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) return { error: "Format email atau password salah" };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email atau password salah." };
  }

  redirect("/dashboard");
}

// --- 2. REGISTER EMAIL ---
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validated = registerSchema.safeParse({
    full_name,
    email,
    password,
    confirmPassword,
  });

  if (!validated.success) return { error: "Data tidak valid. Cek input Anda." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback?next=/verify/success`,
      data: {
        full_name,
        username: email.split("@")[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${full_name}`,
      },
    },
  });

  if (error) return { error: error.message };

  if (data.user && !data.session) {
    return { success: true, requireVerify: true, email };
  }
  return { success: true, requireVerify: false };
}

// --- 3. OAUTH (GOOGLE & GITHUB) ---
export async function loginWithGithub() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });
  if (data.url) redirect(data.url);
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (data.url) redirect(data.url);
}

// --- 4. LOGOUT ---
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// --- 5. RESEND EMAIL ---
export async function resendVerificationEmail(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// --- 6. FORGOT PASSWORD (BARU) ---
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const validated = forgotPasswordSchema.safeParse({ email });
  if (!validated.success) return { error: "Format email tidak valid" };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback?next=/reset-password`,
  });

  if (error) return { error: error.message };

  return { success: true };
}

// --- 7. RESET PASSWORD (BARU) ---
export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validated = resetPasswordSchema.safeParse({
    password,
    confirmPassword,
  });
  if (!validated.success)
    return { error: "Password tidak valid atau tidak cocok" };

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { error: error.message };

  return { success: true };
}
