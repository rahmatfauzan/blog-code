"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, SearchX, LayoutGrid, List as ListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/explore/search-bar";
import { SnippetCard } from "@/components/shared/document-card";
import { SnippetItem } from "@/components/snippet/snippets-item";
import { cn } from "@/lib/utils";

interface SnippetListManagerProps {
  snippets: any[];
  total: number;
  query: string;
}

export function SnippetListManager({
  snippets,
  total,
  query,
}: SnippetListManagerProps) {
  // STATE LOKAL: Ganti view instan tanpa reload server
  const [view, setView] = useState<"card" | "list">("list");

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-0 animate-in fade-in duration-500">
      {/* --- HEADER --- */}
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

      {/* --- TOOLBAR --- */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
        <div className="w-full md:flex-1 md:max-w-2xl">
          <SearchBar
            basePath="/dashboard/snippets"
            placeholder="Cari judul, deskripsi, atau tag..."
          />
        </div>

        {/* VIEW TOGGLE (Client Side) */}
        <div className="self-end md:self-auto flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setView("card")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              view === "card"
                ? "bg-white dark:bg-slate-950 text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Card</span>
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              view === "list"
                ? "bg-white dark:bg-slate-950 text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            )}
          >
            <ListIcon className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      {snippets.length > 0 ? (
        <div
          className={cn(
            view === "card"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-3"
          )}
        >
          {snippets.map((snippet) =>
            view === "card" ? (
              <div key={snippet.id} className="relative group h-full">
                {/* @ts-ignore */}
                  <SnippetCard snippet={snippet} customLink={`/dashboard/snippets/${snippet.id}`} />
              </div>
            ) : (
              // @ts-ignore
              <SnippetItem key={snippet.id} snippet={snippet} />
            )
          )}
        </div>
      ) : (
        // EMPTY STATE
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
