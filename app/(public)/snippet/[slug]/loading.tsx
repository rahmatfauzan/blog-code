import { Skeleton } from "@/components/ui/skeleton";

export default function SnippetLoading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 pb-24">
      {/* Back Button */}
      <Skeleton className="h-10 w-32 mb-6 rounded-lg" />

      {/* --- HEADER SKELETON --- */}
      <div className="space-y-6 mb-8">
        {/* Badges */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          {/* Date Skeleton */}
          <Skeleton className="h-4 w-32 hidden md:block" />
        </div>

        {/* Title & Desc */}
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 rounded-xl" />
          <Skeleton className="h-12 w-1/2 rounded-xl" />

          {/* Description Box */}
          <div className="mt-4 pl-4 border-l-4 border-slate-200 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>

        {/* Meta Info Bar (Author & Stats) */}
        <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-slate-100 dark:border-slate-800 gap-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Stats (View/Like/Bookmark) */}
          <div className="flex gap-4">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
      </div>

      {/* --- CODE CONTENT SKELETON --- */}
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 h-[500px] w-full relative">
        {/* Fake Code Header */}
        <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <div className="w-3 h-3 rounded-full bg-slate-600" />
          <div className="w-3 h-3 rounded-full bg-slate-600" />
        </div>

        {/* Fake Code Lines */}
        <div className="p-6 space-y-3 opacity-50">
          <Skeleton className="h-4 w-1/3 bg-slate-700" />
          <Skeleton className="h-4 w-1/2 bg-slate-700" />
          <Skeleton className="h-4 w-2/3 bg-slate-700" />
          <Skeleton className="h-4 w-1/4 bg-slate-700" />
          <div className="h-4" /> {/* Spacer */}
          <Skeleton className="h-4 w-full bg-slate-700" />
          <Skeleton className="h-4 w-5/6 bg-slate-700" />
          <Skeleton className="h-4 w-4/5 bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
