"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";

interface ViewToggleProps {
  currentView: string;
}

export function ViewToggle({ currentView }: ViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative inline-flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      {/* Sliding Background */}
      <motion.div
        layout
        className="absolute top-1 bottom-1 rounded-md bg-white dark:bg-slate-700 shadow-sm"
        initial={false}
        animate={{
          x: currentView === "card" ? 0 : "100%",
          width: "47%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      <div className="relative z-10 flex w-full">
        <button
          onClick={() => handleViewChange("card")}
          className={`w-1/2 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentView === "card"
              ? "text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <LayoutGrid className="w-4 h-4" /> Card
        </button>

        <button
          onClick={() => handleViewChange("list")}
          className={`w-1/2 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            currentView === "list"
              ? "text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <List className="w-4 h-4" /> List
        </button>
      </div>
    </div>
  );
}
