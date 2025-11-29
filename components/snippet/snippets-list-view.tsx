"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SnippetCard } from "@/components/shared/document-card";
import { cn } from "@/lib/utils";

interface SnippetListViewerProps {
  snippets: any[]; // Sesuaikan tipe datanya
}

export function SnippetListViewer({ snippets }: SnippetListViewerProps) {
  // STATE LOKAL: Ganti tampilan instan tanpa reload server
  const [view, setView] = useState<"list" | "card">("list");

  if (snippets.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Belum ada aktivitas snippet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header dengan Tombol Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Aktivitas Terbaru
        </h3>

        <div className="flex items-center gap-4">
          {/* TOMBOL TOGGLE (Client Side) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setView("card")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                view === "card"
                  ? "bg-white dark:bg-slate-700 shadow text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                view === "list"
                  ? "bg-white dark:bg-slate-700 shadow text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/dashboard/snippets"
            className="text-sm text-indigo-600 hover:underline"
          >
            Lihat Semua
          </Link>
        </div>
      </div>

      {/* Render Berdasarkan State View */}
      <div
        className={cn(
          "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm",
          view === "card"
            ? "bg-transparent border-0 shadow-none overflow-visible"
            : ""
        )}
      >
        {view === "list" ? (
          // --- TAMPILAN LIST ---
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {snippets.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors shrink-0">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/snippets/${item.id}/edit`}
                      className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 block truncate"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="capitalize font-medium">
                        {item.language}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href={`/snippet/${item.slug}`} target="_blank">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          // --- TAMPILAN CARD ---
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snippets.map((item) => (
              // Reuse SnippetCard yang sudah ada
              <SnippetCard key={item.id} snippet={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
