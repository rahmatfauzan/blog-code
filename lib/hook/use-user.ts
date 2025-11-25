"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 1. Cek sesi saat ini (Initial Load)
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 2. Pasang pendengar (Listener) Real-time
    // Ini ajaibnya: Jika user login/logout, fungsi ini otomatis jalan.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Bersihkan listener saat komponen dicopot (Unmount)
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
