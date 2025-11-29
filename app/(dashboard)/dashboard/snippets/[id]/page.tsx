import { CodeViewer } from "@/components/shared/code-viewer";
import { SnippetActions } from "@/components/snippet/snippets-action";
import { ViewCounter } from "@/components/snippet/view-counter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { documents } from "@/lib/queries/documents";
import { cn, LANGUAGE_COLORS } from "@/lib/utils";
import {
  Bookmark,
  Calendar,
  Code2,
  Eye,
  Heart,
  Pencil,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SnippetsDetailPage({ params }: PageProps) {
  {
    const { id } = await params;
    const snippet = await documents.getById(id);
    console.log(snippet);

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

        {/* --- HEADER ATAS (Back & Edit) --- */}
        <div className="flex items-center justify-between mb-6 mt-6">
          <BackButton />
          <Link href={`/dashboard/snippets/${snippet.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
            >
              <Pencil className="w-4 h-4" />
              Edit Snippet
            </Button>
          </Link>
        </div>

        {/* --- HEADER SECTION --- */}
        <div className="space-y-6 mb-2 mt-6">
          {/* Badges: Language & Visibility */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
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
              <Badge variant="outline" className="gap-1.5 py-1 px-3">
                {snippet.visibility === "draft" ? "Draft" : "Published"}
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
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
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
}
