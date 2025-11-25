"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Increment View (Panggil RPC Database)
export async function incrementView(documentId: string) {
  const supabase = await createClient();

  // Panggil fungsi SQL 'increment_view_count' yang sudah kita buat di awal
  await supabase.rpc("increment_view_count", { doc_id: documentId });
}

// 2. Toggle Like
export async function toggleLike(documentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Cek apakah sudah like?
  const { data: existing } = await supabase
    .from("likes")
    .select("user_id")
    .eq("document_id", documentId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // Kalau ada -> Hapus (Unlike)
    await supabase
      .from("likes")
      .delete()
      .match({ document_id: documentId, user_id: user.id });
    return { status: "unliked" };
  } else {
    // Kalau tidak ada -> Tambah (Like)
    await supabase
      .from("likes")
      .insert({ document_id: documentId, user_id: user.id });
    return { status: "liked" };
  }
}

// 3. Toggle Bookmark
export async function toggleBookmark(documentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("user_id")
    .eq("document_id", documentId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase
      .from("bookmarks")
      .delete()
      .match({ document_id: documentId, user_id: user.id });
    return { status: "removed" };
  } else {
    await supabase
      .from("bookmarks")
      .insert({ document_id: documentId, user_id: user.id });
    return { status: "added" };
  }
}

// 4. Cek Status User (Untuk Client Component)
export async function getUserInteraction(documentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { hasLiked: false, hasBookmarked: false };

  const [likeRes, bookmarkRes] = await Promise.all([
    supabase
      .from("likes")
      .select("user_id")
      .match({ document_id: documentId, user_id: user.id })
      .single(),
    supabase
      .from("bookmarks")
      .select("user_id")
      .match({ document_id: documentId, user_id: user.id })
      .single(),
  ]);

  return {
    hasLiked: !!likeRes.data,
    hasBookmarked: !!bookmarkRes.data,
  };
}
