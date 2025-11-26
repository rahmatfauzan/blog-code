"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { value: "all", label: "Semua Bahasa" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "php", label: "PHP" },
  { value: "rust", label: "Rust" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
];

// ✅ Props untuk kustomisasi
interface SearchBarProps {
  basePath?: string; // Path dasar untuk redirect (default: /explore)
  placeholder?: string; // Placeholder input
  showLanguageFilter?: boolean; // Tampilkan filter bahasa atau tidak
}

export function SearchBar({
  basePath = "/explore",
  placeholder = "Cari snippet (contoh: auth, navbar, api)...",
  showLanguageFilter = true,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");

  // ✅ Sync input value dengan URL saat searchParams berubah
  useEffect(() => {
    setInputValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    params.set("page", "1");
    router.replace(`${basePath}?${params.toString()}`);
  }, 300);

  const handleLanguageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value && value !== "all") {
      params.set("lang", value);
    } else {
      params.delete("lang");
    }

    params.set("page", "1");
    router.replace(`${basePath}?${params.toString()}`);
  };

  const clearSearch = () => {
    setInputValue("");
    handleSearch("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Input Search */}
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />

        <Input
          placeholder={placeholder}
          className="pl-10 pr-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 rounded-xl shadow-sm"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e.target.value);
          }}
        />

        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter Bahasa (Opsional) */}
      {showLanguageFilter && (
        <div className="w-full md:w-[240px]">
          <Select
            defaultValue={searchParams.get("lang") || "all"}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger
              size="md"
              className="w-full h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:ring-indigo-500"
            >
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Semua Bahasa" />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
