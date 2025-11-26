"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteSnippet } from "@/lib/actions/snippets";

interface SnippetOperationsProps {
  snippetId: string;
}

export function SnippetOperations({ snippetId }: SnippetOperationsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah klik tembus ke card
    e.stopPropagation();

    toast.warning("Hapus snippet ini?", {
      description: "Tindakan ini permanen dan tidak bisa dibatalkan.",
      action: {
        label: "Hapus",
        onClick: () => {
          startTransition(async () => {
            const res = await deleteSnippet(snippetId);
            if (res.error) {
              toast.error(res.error);
            } else {
              toast.success("Snippet dihapus");
              router.refresh();
            }
          });
        },
      },
    });
  };

  return (
    <div onClick={(e) => e.preventDefault()}>
      {" "}
      {/* Wrapper agar link card tidak terpencet */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <Link href={`/dashboard/snippets/${snippetId}/edit`}>
            <DropdownMenuItem className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
