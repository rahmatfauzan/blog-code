import Link from "next/link";
import {
  Eye,
  Heart,
  FileCode2,
  Plus,
  ArrowRight,
  UserCog,
  Code2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { dashboard } from "@/lib/queries/dashboard";
import { documents } from "@/lib/queries/documents";

export const metadata = {
  title: "Dashboard - CodeBox",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Data Paralel (Stats & Recent Snippets)
  const [stats, { data: recentSnippets }] = await Promise.all([
    dashboard.getStats(user.id),
    documents.getPublicDocuments({
      authorId: user.id,
      page: 1,
      limit: 3,
    }),
  ]);

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* --- 1. HEADER & CTA --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Ringkasan aktivitas dan performa kode Anda
            </p>
          </div>
          <Link href="/dashboard/create" className="sm:shrink-0">
            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Buat Snippet
            </Button>
          </Link>
        </div>

        {/* --- 2. ALERT PROFILE --- */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="shrink-0 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <UserCog className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Lengkapi Profil Developer Anda
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Tambahkan bio, GitHub, dan LinkedIn agar profil terlihat lebih
                  profesional
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="w-full sm:w-auto sm:shrink-0"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-xs border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Edit Profil
              </Button>
            </Link>
          </div>
        </div>

        {/* --- 3. STATISTIK GRID --- */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Snippet
              </CardTitle>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                <FileCode2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalSnippets}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kode tersimpan
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Views
              </CardTitle>
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kali dilihat
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Likes
              </CardTitle>
              <div className="p-2 bg-rose-50 dark:bg-rose-950 rounded-lg">
                <Heart className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.totalLikes.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Apresiasi komunitas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- 4. CONTENT GRID --- */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {/* Kolom Kiri: Recent Snippets (2 kolom di desktop) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Aktivitas Terbaru
              </h3>
              <Link
                href="/dashboard/snippets"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                Lihat Semua
              </Link>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {recentSnippets.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentSnippets.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Icon */}
                        <div className="shrink-0 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition-colors">
                          <Code2 className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/dashboard/snippets/${item.id}/edit`}
                            className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 block truncate text-sm transition-colors"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span className="capitalize font-medium">
                              {item.language}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">
                              •
                            </span>
                            <span>
                              {new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Arrow */}
                      <Link
                        href={`/snippet/${item.slug}`}
                        target="_blank"
                        className="shrink-0"
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-full transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                    <FileCode2 className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Belum ada snippet yang dibuat
                  </p>
                  <Link href="/dashboard/create" className="inline-block mt-3">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Plus className="w-3 h-3 mr-1" />
                      Buat Snippet Pertama
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>

          {/* Kolom Kanan: Tips Card (1 kolom di desktop) */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white invisible">
                Placeholder
              </h3>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-500 to-violet-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold text-base">Tips Pro</h3>
                </div>
                <p className="text-sm text-white/90 leading-relaxed mb-4">
                  Gunakan deskripsi yang jelas dan tag yang relevan agar snippet
                  Anda mudah ditemukan oleh developer lain.
                </p>
                <div className="pt-3 border-t border-white/20">
                  <p className="text-xs text-white/80">
                    💡 Update rutin meningkatkan visibility
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
