"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Globe, 
  Lock,
  FileText,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGE_COLORS, cn } from "@/lib/utils";
import { SnippetWithAuthor } from "@/lib/types";
import { deleteSnippet } from "@/lib/actions/snippets";

interface SnippetItemProps {
  snippet: SnippetWithAuthor;
}

export function SnippetItem({ snippet }: SnippetItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Yakin ingin menghapus snippet ini? Tindakan ini tidak bisa dibatalkan.")) {
      startTransition(async () => {
        const res = await deleteSnippet(snippet.id);
        if (res.error) {
          toast.error("Gagal menghapus", { description: res.error });
        } else {
          toast.success("Snippet berhasil dihapus");
        }
      });
    }
  };

  return (
    <div className="group flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md">
      
      {/* KIRI: Info Snippet */}
      <div className="flex items-center gap-4 min-w-0">
        
        {/* Icon Bahasa */}
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-800",
          "bg-slate-50 dark:bg-slate-900 text-slate-500"
        )}>
           <div className={cn("w-3 h-3 rounded-full", LANGUAGE_COLORS[snippet.language] || "bg-slate-400")} />
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Link 
              href={`snippets/${snippet.id}`} 
              className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate text-base"
            >
              {snippet.title}
            </Link>
            
            {/* Badges */}
            {snippet.status === 'draft' && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-yellow-100 text-yellow-700 border-yellow-200">
                Draft
              </Badge>
            )}
            {snippet.visibility === 'private' && (
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-slate-200 text-slate-500 gap-1">
                <Lock className="w-3 h-3" /> Private
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="capitalize flex items-center gap-1">
              <FileText className="w-3 h-3" /> {snippet.language}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {snippet.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> 
              {new Date(snippet.updated_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
      </div>

      {/* KANAN: Actions */}
      <div className="flex items-center gap-2">
        {/* Edit Button (Langsung) */}
        <Link href={`snippets/${snippet.id}/edit`}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hidden sm:flex">
            <Pencil className="w-4 h-4" />
          </Button>
        </Link>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <Link href={`snippets/${snippet.id}/edit`}>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
            </Link>
            <Link href={`snippets/${snippet.id}`} target="_blank">
              <DropdownMenuItem className="cursor-pointer">
                <Globe className="w-4 h-4 mr-2" /> Lihat Live
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}