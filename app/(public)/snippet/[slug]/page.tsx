export const revalidate = 60;
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Code2,
  User,
  Bookmark,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { documents } from "@/lib/queries/documents";
import { cn, LANGUAGE_COLORS } from "@/lib/utils";
import { BackButton } from "@/components/ui/back-button";
import { CodeViewer } from "@/components/shared/code-viewer";
import { SnippetActions } from "@/components/snippet/snippets-action";
import { ViewCounter } from "@/components/snippet/view-counter";

// Komponen Placeholder (Nanti kita buat file aslinya)

interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. SEO Metadata Generator
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const snippet = await documents.getBySlug(slug);

  if (!snippet) {
    return {
      title: "Snippet Tidak Ditemukan - CodeBox",
    };
  }

  return {
    title: `${snippet.title} - CodeBox`,
    description:
      snippet.description || `Lihat kode ${snippet.title} di CodeBox.`,
    keywords: snippet.meta_keywords || ["code", "snippet"],
    openGraph: {
      title: snippet.title,
      description: snippet.description || "",
      type: "article",
      authors: [snippet.author?.full_name || "CodeBox User"],
    },
  };
}

// 2. Halaman Utama
export default async function PublicSnippetPage({ params }: PageProps) {
  const { slug } = await params;
  console.log("Received Slug:", slug);
  // Fetch Data (Server Side)
  const snippet = await documents.getBySlug(slug);
  console.log("Fetched Snippet:", snippet);

  if (!snippet) {
    return notFound();
  }

  // Data Author
  const authorName = snippet.author?.full_name || "Anonymous";
  const authorUsername = snippet.author?.username || "anonymous";
  const authorInitials = authorName.charAt(0).toUpperCase();

  // Format Angka
  const formatCount = (num: number) =>
    Intl.NumberFormat("en-US", { notation: "compact" }).format(num);

  // Format Tanggal
  const formattedDate = new Date(snippet.created_at).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Komponen Invisible untuk increment view */}
      <ViewCounter documentId={snippet.id} />

      {/* --- HEADER SECTION --- */}
      <div className="space-y-6 mb-2 mt-6">
        {/* Badges: Language & Visibility */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <BackButton />
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="gap-1.5 py-1 px-3 text-sm font-medium bg-slate-100 dark:bg-slate-800"
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  LANGUAGE_COLORS[snippet.language] || "bg-slate-500"
                )}
              />
              <span className="capitalize">{snippet.language}</span>
            </Badge>

            <Badge variant="outline" className="gap-1.5 py-1 px-3">
              {snippet.visibility === "public" ? "Public" : "Private"}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {snippet.title}
        </h1>

        {/* Description */}
        {snippet.description && (
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-indigo-500 pl-4 py-1">
            {snippet.description}
          </p>
        )}

        {/* Tags */}
        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-slate-400" />
            {snippet.tags.map((tag) => (
              <Link key={tag.slug} href={`/explore?tag=${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                >
                  #{tag.name}t
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Meta Info Bar */}
        <div className="flex flex-wrap items-start sm:items-center  justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Author & Date */}
          <div className="flex items-center gap-2 sm:gap-6 flex-col sm:flex-row justify-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                <AvatarImage src={snippet.author?.avatar_url || ""} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-slate-900 dark:text-white leading-none">
                  {authorName}
                </span>
                <span className="text-xs">@{authorUsername}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" title="Views">
              <Eye className="h-4 w-4" />
              <span className="font-medium">
                {formatCount(snippet.view_count || 0)}
              </span>
            </div>
            {snippet.likes && (
              <div className="flex items-center gap-1" title="Likes">
                <Heart className="h-4 w-4" />
                <span className="font-medium">
                  {formatCount(snippet.likes || 0)}
                </span>
              </div>
            )}
            {snippet.bookmark != 0 && (
              <div className="flex items-center gap-1" title="Bookmarks">
                <Bookmark className="h-4 w-4" />
                <span className="font-medium">
                  {formatCount(snippet.bookmark || 0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-10">
        <div
          className="flex items-center gap-1.5 text-xs md:text-sm"
          title="Created At"
        >
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-end">
          <SnippetActions
            documentId={snippet.id}
            initialLikeCount={snippet.likes || 0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-xl overflow-hidden">
          {snippet.content ? (
            <CodeViewer code={snippet.content} language={snippet.language} />
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-50 dark:bg-slate-900">
              <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Tidak ada konten kode untuk ditampilkan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
