import Link from "next/link";
import { Plus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { documents } from "@/lib/queries/documents";
import { SearchBar } from "@/components/explore/search-bar";
import { SnippetCard } from "@/components/shared/document-card";
import { ViewToggle } from "@/components/shared/view-toggle";
import { SnippetItem } from "@/components/snippet/snippets-item";

export const metadata = {
  title: "My Snippets | Dashboard",
};

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; view?: string }>;
}

export default async function MySnippetsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const page = Number(params.page) || 1;
  const view = params.view || "list"; // Default view

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Data
  const { data: snippets, total } = await documents.getMyDocuments({
    userId: user.id,
    query,
    page,
    limit: 12,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-0 animate-in fade-in duration-500">
      {/* --- 1. HEADER SECTION --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Snippets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kelola <span className="font-medium text-indigo-600">{total}</span>{" "}
            snippet yang telah Anda buat.
          </p>
        </div>

        <Link href="/dashboard/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 gap-2">
            <Plus className="w-4 h-4" />
            Buat Baru
          </Button>
        </Link>
      </div>

      {/* --- 2. TOOLBAR SECTION (Search & Toggle) --- */}
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        {/* Area Search (Lebar penuh di mobile, fleksibel di desktop) */}
        <div className="w-full md:flex-1 md:max-w-2xl">
          <SearchBar
            basePath="/dashboard/snippets"
            placeholder="Cari judul, deskripsi, atau tag..."
          />
        </div>

        {/* Area Toggle View (Fixed di kanan) */}
        <div className="self-end md:self-auto">
          <ViewToggle currentView={view} />
        </div>
      </div>

      {/* --- 3. CONTENT AREA --- */}
      {snippets.length > 0 ? (
        <div
          className={
            view === "card"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" // Grid Responsive
              : "flex flex-col gap-3" // List Stack
          }
        >
          {snippets.map((snippet) =>
            view === "card" ? (
              // Tampilan CARD (Grid)
              // @ts-ignore
              <SnippetCard key={snippet.id} snippet={snippet} />
            ) : (
              // Tampilan LIST (Row)
              // @ts-ignore
              <SnippetItem key={snippet.id} snippet={snippet} />
            )
          )}
        </div>
      ) : (
        // --- EMPTY STATE ---
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <SearchX className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Tidak ada snippet ditemukan
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            {query
              ? `Tidak ada hasil untuk pencarian "${query}". Coba kata kunci lain.`
              : "Anda belum membuat snippet apapun. Yuk mulai koding!"}
          </p>

          {!query && (
            <Link href="/dashboard/create" className="mt-8">
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" /> Mulai Membuat
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
