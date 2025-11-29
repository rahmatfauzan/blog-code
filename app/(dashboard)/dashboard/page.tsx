import Link from "next/link";
import { Eye, Heart, FileCode2, Plus, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { dashboard } from "@/lib/queries/dashboard";
import { documents } from "@/lib/queries/documents";
import { SnippetListViewer } from "@/components/snippet/snippets-list-view";

export const metadata = { title: "Dashboard - CodeBox" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Fetch Data di Server (Cukup sekali saat load halaman)
  const [stats, { data: recentSnippets }] = await Promise.all([
    dashboard.getStats(user.id),
    documents.getPublicDocuments({ authorId: user.id, page: 1, limit: 4 }),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Ringkasan aktivitas Anda.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Buat Snippet
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Snippet
            </CardTitle>
            <FileCode2 className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSnippets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Likes
            </CardTitle>
            <Heart className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalLikes.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Area */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* KOLOM KIRI (2/3): Snippet List Viewer (Client Component) */}
        <div className="md:col-span-2">
          {/* Data dikirim ke client component, switch view jadi instan! */}
          <SnippetListViewer snippets={recentSnippets} />
        </div>

        {/* Kolom Kanan (Tips) */}
        <div className="bg-slate-900 rounded-xl p-6 text-white h-fit">
          <h3 className="font-bold mb-2">Tips Pro 💡</h3>
          <p className="text-sm text-slate-300">
            Gunakan deskripsi yang jelas agar snippet Anda mudah ditemukan.
          </p>
        </div>
      </div>
    </div>
  );
}
