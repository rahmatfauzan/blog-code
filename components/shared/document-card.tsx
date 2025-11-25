"use client";

import Link from "next/link";
import { Eye, Clock, Heart, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, LANGUAGE_COLORS } from "@/lib/utils";
import { SnippetWithAuthor } from "@/lib/types";
// --- Helper Date Sederhana (Agar tidak perlu install date-fns jika belum) ---
function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}j lalu`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}h lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface SnippetCardProps {
  snippet: SnippetWithAuthor;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  // Fallback Data
  const authorName = snippet.author?.full_name || "Anonymous";
  const authorUsername = snippet.author?.username || "user";
  const authorInitials = authorName.charAt(0).toUpperCase();

  // Format Angka (1.2k)
  const formatCount = (num: number) =>
    Intl.NumberFormat("en-US", { notation: "compact" }).format(num);

  return (
    <div className="h-full">
      <Link href={`/snippet/${snippet.slug}`} className="block h-full">
        <div className="group h-full p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 relative flex flex-col">
          {/* --- HEADER --- */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-slate-100 dark:border-slate-800">
                <AvatarImage
                  src={snippet.author?.avatar_url || ""}
                  alt={authorName}
                />
                <AvatarFallback className="text-xs bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-400">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-900 dark:text-white truncate max-w-[120px]">
                  {authorName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  @{authorUsername}
                </span>
              </div>
            </div>

            {/* Language Dot */}
            <div
              className={cn(
                "w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm",
                LANGUAGE_COLORS[snippet.language] || LANGUAGE_COLORS.plaintext
              )}
              title={snippet.language}
            />
          </div>

          {/* --- CONTENT --- */}
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {snippet.title}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed h-10">
              {snippet.description || "Tidak ada deskripsi singkat."}
            </p>
          </div>

          {/* --- TAGS --- */}
          <div className="flex flex-wrap gap-2 mb-4 h-6 overflow-hidden">
            {snippet.tags?.slice(0, 3).map((tag, index) => (
              <span
                key={`${snippet.id}-${tag.slug || index}`}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors"
              >
                #{tag.name}
              </span>
            ))}
          </div>

          {/* --- FOOTER (STATS) --- */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
            {/* Kiri: Views & Interactions */}
            <div className="flex items-center gap-3">
              {/* Views */}
              <div className="flex items-center gap-1" title="Views">
                <Eye className="w-3.5 h-3.5" />
                <span className="font-medium">
                  {formatCount(snippet.view_count || 0)}
                </span>
              </div>

              {/* Like (Muncul jika > 0) */}
              {(snippet.likes || 0) > 0 && (
                <div
                  className="flex items-center gap-1 text-rose-500 font-medium"
                  title="Likes"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{formatCount(snippet.likes!)}</span>
                </div>
              )}

              {/* Bookmark (Muncul jika > 0) */}
              {(snippet.bookmark || 0) > 0 && (
                <div
                  className="flex items-center gap-1 text-indigo-500 font-medium"
                  title="Bookmarks"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                  <span>{formatCount(snippet.bookmark!)}</span>
                </div>
              )}
            </div>

            {/* Kanan: Time */}
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              <time dateTime={snippet.created_at}>
                {formatRelativeDate(snippet.created_at)}
              </time>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
