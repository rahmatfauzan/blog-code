import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function SnippetLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 pb-20">
      {/* Back Button Skeleton */}
      <Skeleton className="h-10 w-32 mb-6 rounded-lg" />

      {/* --- HEADER SECTION --- */}
      <div className="space-y-6 mb-10 mt-6">
        {/* Badges */}
        <div className="flex gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-3/4 rounded-lg" />
          <Skeleton className="h-10 w-1/2 rounded-lg" />
        </div>

        {/* Description */}
        <div className="space-y-2 border-l-4 border-slate-200 pl-4 py-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>

        {/* Meta Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>

      {/* --- ACTIONS & CODE --- */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
        </div>

        {/* Code Viewer Skeleton (Kotak Besar Gelap) */}
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 h-[500px] w-full relative">
          <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <div className="w-3 h-3 rounded-full bg-slate-600" />
          </div>
          <div className="p-6 space-y-3">
            <Skeleton className="h-4 w-1/3 bg-slate-800" />
            <Skeleton className="h-4 w-1/2 bg-slate-800" />
            <Skeleton className="h-4 w-2/3 bg-slate-800" />
            <Skeleton className="h-4 w-full bg-slate-800" />
            <Skeleton className="h-4 w-5/6 bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
