import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Code2, Lock, FileText } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { documents } from "@/lib/queries/documents";
import { SnippetCard } from "@/components/shared/document-card";
import { Badge } from "@/components/ui/badge";
import { ProfileHeader } from "@/components/profile/profile";
import { profiles } from "@/lib/queries/profiles";

interface PageProps {
  params: Promise<{ username: string }>;
}

// 1. Generate SEO Metadata
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await profiles.getByUsername(username);

  if (!profile) {
    return { title: "User Tidak Ditemukan | CodeBox" };
  }

  return {
    title: `${profile.full_name} (@${profile.username}) | CodeBox`,
    description:
      profile.bio || `Koleksi snippet kode dari ${profile.full_name}.`,
    openGraph: {
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

// 2. Halaman Utama
export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // A. Ambil Data Profile dari URL
  const profile = await profiles.getByUsername(username);

  if (!profile) {
    return notFound();
  }

  // B. Cek Apakah User yang Login adalah Pemilik Profil ini?
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  // C. Ambil Snippet berdasarkan Author ID
  // RLS di Database otomatis memfilter:
  // - Owner -> Dapat Semua (Draft, Private, Public)
  // - Guest -> Dapat Public Only
  const { data: snippets } = await documents.getPublicDocuments({
    authorId: profile.id,
    limit: 100, // atau sesuaikan dengan kebutuhan
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 pb-24 min-h-screen">
      {/* Header Profil (Avatar, Bio, Statistik) */}
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        stats={{ totalSnippets: snippets.length }}
      />

      {/* Section Daftar Snippet */}
      <div className="space-y-6">
        {/* Judul Section */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            {isOwner ? "Koleksi Saya" : `Koleksi ${profile.full_name}`}
            <span className="text-sm font-normal text-slate-500 ml-1">
              ({snippets.length})
            </span>
          </h2>
        </div>

        {/* Grid Content */}
        {snippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <div key={snippet.id} className="relative group">
                {/* --- KHUSUS OWNER: Badge Status --- */}
                {/* Badge ini cuma muncul kalau Anda pemiliknya */}
                {isOwner && (
                  <div className="absolute top-3 right-3 z-20 flex gap-2">
                    {snippet.status === "draft" && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 shadow-sm gap-1">
                        <FileText className="w-3 h-3" /> Draft
                      </Badge>
                    )}

                    {/* Kalau public tapi status published, gak usah dikasih badge biar bersih */}
                    {snippet.visibility === "private" && (
                      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 shadow-sm gap-1">
                        <Lock className="w-3 h-3" /> Private
                      </Badge>
                    )}
                  </div>
                )}

                {/* Kartu Snippet */}
                {/* @ts-ignore - Type mismatch minor aman diabaikan */}
                <SnippetCard snippet={snippet} />
              </div>
            ))}
          </div>
        ) : (
          // Tampilan Kosong (Empty State)
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Code2 className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              Belum ada snippet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center mt-1 mb-6">
              {isOwner
                ? "Anda belum membuat snippet apapun. Yuk mulai!"
                : "User ini belum mempublikasikan snippet apapun."}
            </p>

            {/* Tombol Buat Baru (Hanya untuk Owner) */}
            {isOwner && (
              <a
                href="/dashboard/create"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
              >
                + Buat Snippet Baru
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
