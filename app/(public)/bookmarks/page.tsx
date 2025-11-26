import Link from "next/link";
import { Bookmark, SearchX, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { documents } from "@/lib/queries/documents";
import { SnippetCard } from "@/components/shared/document-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Bookmarks | CodeBox",
  description: "Koleksi snippet yang Anda simpan.",
};

export default async function MyBookmarksPage() {
  const supabase = await createClient();

  // 1. Cek User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 2. Fetch Bookmarks
  const snippets = await documents.getBookmarked(user.id);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-indigo-600" />
          Bookmarks Saya
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Daftar kode yang Anda simpan untuk dibaca nanti.
        </p>
      </div>

      {/* Content Grid */}
      <div className="space-y-6">
        {snippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              // @ts-ignore - Type safe via transformation
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        ) : (
          // Empty State (Jika belum ada bookmark)
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
              <Bookmark className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Belum ada yang disimpan
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
              Jelajahi snippet menarik dan simpan di sini agar mudah ditemukan
              kembali.
            </p>

            <Link href="/explore">
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                Mulai Jelajah <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
