import Link from "next/link";
import { Github, Linkedin, Globe, Settings, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Profile } from "@/lib/types";

interface ProfileHeaderProps {
  profile: Profile;
  isOwner: boolean;
  stats: {
    totalSnippets: number;
  };
}

export function ProfileHeader({ profile, isOwner, stats }: ProfileHeaderProps) {
  // 1. Format Tanggal Bergabung (contoh: "Januari 2024")
  const joinDate = new Date(profile.created_at).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  // 2. Ambil inisial nama untuk fallback avatar
  const initial = profile.full_name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* --- AVATAR --- */}
        <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-slate-50 dark:border-slate-800 shadow-xl">
          <AvatarImage src={profile.avatar_url || ""} alt={profile.username || ""} />
          <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-600 font-bold">
            {initial}
          </AvatarFallback>
        </Avatar>

        {/* --- INFO USER --- */}
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {profile.full_name}
              </h1>
              <p className="text-slate-500 font-medium">@{profile.username}</p>
            </div>

            {/* Tombol Edit (Hanya muncul jika Owner) */}
            {isOwner && (
              <Link href="/dashboard/settings">
                <Button variant="outline" className="gap-2 w-full md:w-auto">
                  <Settings className="w-4 h-4" />
                  Edit Profil
                </Button>
              </Link>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Meta Details & Socials */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            {/* Tanggal Join */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Bergabung {joinDate}</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block" />

            {/* Social Links (Hanya render jika ada datanya) */}
            <div className="flex gap-4">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Website</span>
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
