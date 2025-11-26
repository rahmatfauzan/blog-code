import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-10 min-h-screen">
      {/* 1. Header Section Skeleton */}
      <div className="max-w-2xl mb-8 space-y-3">
        <Skeleton className="h-10 w-64 rounded-lg" /> {/* Title */}
        <Skeleton className="h-5 w-full max-w-md rounded-md" /> {/* Subtitle */}
      </div>

      {/* 3. Grid Skeleton (Snippet Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Render 9 kartu dummy */}
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col h-[240px] p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            {/* Card Header: Avatar + User + Lang */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24" /> {/* Name */}
                  <Skeleton className="h-2 w-16" /> {/* Username */}
                </div>
              </div>
              <Skeleton className="h-3 w-3 rounded-full" /> {/* Language Dot */}
            </div>

            {/* Card Content: Title & Desc */}
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Title */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-full" /> {/* Desc Line 1 */}
                <Skeleton className="h-3 w-2/3" /> {/* Desc Line 2 */}
              </div>
            </div>

            {/* Card Tags */}
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-5 w-14 rounded-md" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>

            {/* Card Footer: Stats & Date */}
            <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex gap-3">
                <Skeleton className="h-3 w-8" /> {/* Views */}
                <Skeleton className="h-3 w-8" /> {/* Likes */}
              </div>
              <Skeleton className="h-3 w-20" /> {/* Date */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
