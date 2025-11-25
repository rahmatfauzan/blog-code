import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/lib/constants.ts
export const LANGUAGE_COLORS: Record<string, string> = {
  javascript: "bg-yellow-400",
  typescript: "bg-blue-500",
  python: "bg-green-500",
  php: "bg-indigo-500",
  java: "bg-red-500",
  go: "bg-cyan-500",
  rust: "bg-orange-600",
  cpp: "bg-purple-500",
  csharp: "bg-violet-500",
  ruby: "bg-red-400",
  swift: "bg-orange-400",
  kotlin: "bg-purple-400",
  dart: "bg-sky-400",
  sql: "bg-teal-500",
  html: "bg-orange-500",
  css: "bg-blue-400",
  plaintext: "bg-slate-500", // Default fallback
};

export const formatRelativeDate = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "baru saja";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays === 1) {
    return "kemarin";
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  } else if (diffInWeeks === 1) {
    return "seminggu yang lalu";
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} minggu yang lalu`;
  } else if (diffInMonths === 1) {
    return "sebulan yang lalu";
  } else if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  } else if (diffInYears === 1) {
    return "setahun yang lalu";
  } else {
    return `${diffInYears} tahun yang lalu`;
  }
};
