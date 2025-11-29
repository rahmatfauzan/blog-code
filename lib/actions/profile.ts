"use server";

import { createClient } from "@/lib/supabase/server";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validation/profile";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: ProfileFormValues) {
  const supabase = await createClient();

  // 1. Cek Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // 2. Validasi Zod
  const validated = profileSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Data tidak valid. Periksa input Anda." };
  }

  // 3. Update Database
  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: validated.data.avatar_url,
      full_name: validated.data.full_name,
      username: validated.data.username,
      bio: validated.data.bio,
      website: validated.data.website,
      github_url: validated.data.github_url,
      linkedin_url: validated.data.linkedin_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    // Handle error unik username (jika username sudah dipakai orang lain)
    if (error.code === "23505") {
      return { error: "Username sudah digunakan orang lain." };
    }
    return { error: error.message };
  }

  // 4. Refresh Cache
  revalidatePath("/dashboard"); // Refresh sidebar (nama user)
  revalidatePath(`/u/${validated.data.username}`); // Refresh public profile
  revalidatePath("/dashboard/settings"); // Refresh form itu sendiri

  return { success: true };
}
