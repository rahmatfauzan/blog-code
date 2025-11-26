"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Tag as TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: string[]; // Daftar saran dari database
}

export function TagInput({
  value = [],
  onChange,
  placeholder,
  suggestions = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter(
    (item) =>
      item.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(item)
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const addTag = (text: string) => {
    const tag = text.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue("");
      setShowSuggestions(false);
    } else if (tag && value.includes(tag)) {
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Container Input - Single Border */}
      <div className="flex flex-wrap gap-1.5 p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-background focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all min-h-[2.5rem] items-center">
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pr-1 py-0.5 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-0"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 border-0 outline-none focus:outline-none focus:ring-0 p-0 h-6 min-w-[80px] text-sm bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600"
        />
      </div>

      {/* Dropdown Suggestions */}
      {showSuggestions &&
        inputValue.length > 0 &&
        filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 w-full bg-white dark:bg-indigo-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg max-h-48 overflow-y-auto p-1">
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 px-2 py-1 uppercase tracking-wider">
              Saran Tag
            </p>
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="flex items-center w-full gap-2 px-2.5 py-1.5 text-sm text-left rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <TagIcon className="h-3 w-3 text-slate-400" />
                {suggestion}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}
