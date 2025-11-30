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
  Lightbulb,
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

  // Fetch Data Paralel
  const [stats, { data: recentSnippets }] = await Promise.all([
    dashboard.getStats(user.id),
    documents.getPublicDocuments({
      authorId: user.id,
      page: 1,
      limit: 5, // Mengambil 5 agar list terlihat lebih penuh
    }),
  ]);

  return (
    <div className="min-h-screen pb-12 w-full bg-slate-50/30 dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* --- 1. HEADER & CTA --- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Ringkasan aktivitas dan performa kode Anda.
            </p>
          </div>
          <Link href="/dashboard/create" className="sm:shrink-0">
            <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Buat Snippet
            </Button>
          </Link>
        </div>

        {/* --- 2. ALERT PROFILE (Compact) --- */}
        <div className="rounded-lg border border-indigo-100 dark:border-indigo-900/50 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="shrink-0 p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg">
                <UserCog className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Lengkapi Profil Developer
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Tambahkan bio dan sosmed agar profil terlihat profesional.
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
                className="w-full sm:w-auto text-xs h-9"
              >
                Edit Profil
              </Button>
            </Link>
          </div>
        </div>

        {/* --- 3. STATISTIK GRID --- */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Snippet"
            value={stats.totalSnippets}
            desc="Kode tersimpan"
            icon={FileCode2}
            colorClass="text-indigo-600 dark:text-indigo-400"
            bgClass="bg-indigo-50 dark:bg-indigo-950"
          />
          <StatsCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            desc="Kali dilihat"
            icon={Eye}
            colorClass="text-blue-600 dark:text-blue-400"
            bgClass="bg-blue-50 dark:bg-blue-950"
          />
          <StatsCard
            title="Total Likes"
            value={stats.totalLikes.toLocaleString()}
            desc="Apresiasi komunitas"
            icon={Heart}
            colorClass="text-rose-600 dark:text-rose-400"
            bgClass="bg-rose-50 dark:bg-rose-950"
          />
        </div>

        {/* --- 4. CONTENT GRID (Fixed Layout) --- */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-start">
          {/* Kolom Kiri: Recent Snippets (Lebar 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-slate-500" />
                Aktivitas Terbaru
              </h3>
              <Link
                href="/dashboard/snippets"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                Lihat Semua
              </Link>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
              {recentSnippets.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentSnippets.map((item: any) => (
                    <div
                      key={item.id}
                      className="group p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Icon Language */}
                      <div className="shrink-0 hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition-colors">
                        <Code2 className="w-5 h-5" />
                      </div>

                      {/* Content Wrapper - min-w-0 prevents overflow */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/dashboard/snippets/${item.id}/edit`}
                          className="block"
                        >
                          <h4 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.title}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="capitalize bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide">
                            {item.language}
                          </span>
                          <span>•</span>
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

                      {/* Action */}
                      <Link
                        href={`/snippet/${item.slug}`}
                        target="_blank"
                        className="shrink-0"
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-full"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </Card>
          </div>

          {/* Kolom Kanan: Tips Card (Lebar 1/3) */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-8">
            {/* Header dibuat visible agar sejajar dengan Header Kiri */}
            <div className="flex items-center justify-between h-[28px]">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Tips & Info
              </h3>
            </div>

            <Card className="border-0 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-md relative overflow-hidden">
              {/* Dekorasi Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-2 mb-3 text-indigo-100">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Pro Tip
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed mb-4 text-white/95">
                  "Gunakan deskripsi yang jelas dan tag yang relevan agar
                  snippet Anda mudah ditemukan oleh developer lain di
                  komunitas."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS untuk Kebersihan Code ---

function StatsCard({
  title,
  value,
  desc,
  icon: Icon,
  colorClass,
  bgClass,
}: any) {
  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgClass}`}>
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
        <FileCode2 className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-900 dark:text-white">
        Belum ada aktivitas
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mt-1 mb-4">
        Mulai simpan kode snippet pertama Anda sekarang.
      </p>
      <Link href="/dashboard/create">
        <Button size="sm" variant="outline" className="text-xs h-8">
          <Plus className="w-3 h-3 mr-1.5" />
          Buat Snippet
        </Button>
      </Link>
    </div>
  );
}
