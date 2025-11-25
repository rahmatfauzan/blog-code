"use client";

import { motion } from "framer-motion";

export function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="space-y-12">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto animate-pulse" />
          <div className="h-12 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto animate-pulse" />
          <div className="h-6 w-[600px] max-w-full bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-4/6" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SnippetCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-4/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
