"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // <--- 1. IMPORT INI
import { Heart, Bookmark, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toggleLike, toggleBookmark, getUserInteraction } from "@/lib/actions/interaction";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/hook/use-user";

interface SnippetActionsProps {
  documentId: string;
  initialLikeCount: number;
}

export function SnippetActions({ documentId, initialLikeCount }: SnippetActionsProps) {
  const { user } = useUser();
  const router = useRouter();

  const [likes, setLikes] = useState(initialLikeCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    getUserInteraction(documentId).then((res) => {
      setHasLiked(res.hasLiked);
      setHasBookmarked(res.hasBookmarked);
      setIsLoading(false);
    });
  }, [documentId, user]);

  // --- HANDLE LIKE ---
  const handleLike = async () => {
    if (!user) {
      toast.error("Login dulu untuk menyukai snippet ini");
      router.push("/login");
      return;
    }

    // Optimistic Update (Agar UI terasa cepat)
    const previousLiked = hasLiked;
    const previousCount = likes;
    
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);

    try {
      const res = await toggleLike(documentId);
      if (res.error) throw new Error();

      router.refresh(); 

    } catch (err) {
      // Rollback jika gagal
      setHasLiked(previousLiked);
      setLikes(previousCount);
      toast.error("Gagal memproses like");
    }
  };

  // --- HANDLE BOOKMARK ---
  const handleBookmark = async () => {
    if (!user) {
      toast.error("Login dulu untuk menyimpan snippet");
      router.push("/login");
      return;
    }

    const previousBookmarked = hasBookmarked;
    setHasBookmarked(!hasBookmarked);

    try {
      const res = await toggleBookmark(documentId);
      if (res.error) throw new Error();
      
      if (res.status === "added") toast.success("Disimpan ke koleksi");
      else toast.info("Dihapus dari koleksi");

      // <--- 4. TAMBAHKAN INI JUGA: Agar angka bookmark di header update
      router.refresh();

    } catch (err) {
      setHasBookmarked(previousBookmarked);
      toast.error("Gagal memproses bookmark");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link berhasil disalin!");
  };

  return (
    <div className="flex items-center gap-2">
      {/* ... (Sisa kode render tombol TETAP SAMA) ... */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        className={cn(
          "gap-2 transition-colors",
          hasLiked 
            ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-400" 
            : "hover:text-rose-600"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
        )}
        <span>{likes}</span>
      </Button>

      {/* ... Tombol Bookmark & Share ... */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleBookmark}
        className={cn(
          "gap-2 transition-colors",
          hasBookmarked
            ? "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-400"
            : "hover:text-indigo-600"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark className={cn("h-4 w-4", hasBookmarked && "fill-current")} />
        )}
        <span className="hidden sm:inline">{hasBookmarked ? "Saved" : "Save"}</span>
      </Button>

      <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}