"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// TODO: Ganti 'any' dengan tipe Profile dari @/lib/types
interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    let mounted = true; // Prevent state updates if unmounted

    // Fungsi ambil profil
    const getProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          if (mounted) setError(error.message);
          return;
        }

        if (data && mounted) {
          setProfile(data);
        }
      } catch (err) {
        console.error("Profile fetch exception:", err);
        if (mounted) setError("Failed to fetch profile");
      }
    };

    // Fungsi utama cek session
    const getUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          if (mounted) setError(authError.message);
          return;
        }

        if (mounted) {
          setUser(user);
        }

        if (user && mounted) {
          await getProfile(user.id);
        }
      } catch (error) {
        console.error("Get user exception:", error);
        if (mounted) setError("Failed to fetch user");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getUser();

    // Listener perubahan auth (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      const currentUser = session?.user ?? null;

      if (mounted) {
        setUser(currentUser);
      }

      if (currentUser && mounted) {
        await getProfile(currentUser.id);
      } else if (mounted) {
        setProfile(null);
      }

      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    loading,
    error,
    // Helper flags
    isAuthenticated: !!user,
    isReady: !loading,
  };
}
