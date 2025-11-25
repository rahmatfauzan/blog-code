import { Suspense } from "react";
import { Metadata } from "next";
import { Code2, SearchX } from "lucide-react";

import { documents } from "@/lib/queries/documents";
import { SnippetCard } from "@/components/shared/document-card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Explore - CodeBox",
  description: "Temukan ribuan snippet kode berguna dari komunitas.",
};

// Props otomatis dari Next.js untuk akses URL params (?q=...)
interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    lang?: string;
    page?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const language = params.lang || "all";
  const page = Number(params.page) || 1;

  // Fetch Data
  const { data: snippets, total } = await documents.getPublicDocuments({
    query,
    language,
    page,
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 pb-24 min-h-screen">
      
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Jelajahi Snippets
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Cari solusi coding, konfigurasi, dan trik dari komunitas developer.
        </p>
      </div>

      {/* Search & Filter Client Component */}
      {/* <SearchBar /> */}

      {/* Hasil Pencarian */}
      <div className="space-y-6">
        {snippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        ) : (
          // Tampilan Kosong (Empty State)
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <SearchX className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mt-1">
              Coba gunakan kata kunci lain atau ubah filter bahasa.
            </p>
          </div>
        )}
      </div>

      {/* (Opsional) Pagination Sederhana */}
      {/* Anda bisa menambahkan tombol Next/Prev di sini nanti */}
      
    </div>
  );
}