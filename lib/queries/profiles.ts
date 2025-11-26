import { createClient } from "@/lib/supabase/server";
import { Profile } from "../types";

export const profiles = {
  // Ambil data profile berdasarkan Username
  async getByUsername(username: string) {
    const supabase = await createClient();

    // Kita select '*' (semua kolom) dari tabel profiles
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      // console.error("Error fetching profile:", error);
      return null;
    }

    return data as Profile;
  },
};
