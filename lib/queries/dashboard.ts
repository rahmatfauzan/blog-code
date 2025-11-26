import { createClient } from "@/lib/supabase/server";

export const dashboard = {
  async getStats(userId: string) {
    const supabase = await createClient();

    // Ambil semua dokumen milik user (hanya kolom yang dibutuhkan)
    const { data, error } = await supabase
      .from("documents")
      .select(
        `
        view_count,
        likes (count)
      `
      )
      .eq("author_id", userId);

    if (error || !data) {
      return {
        totalSnippets: 0,
        totalViews: 0,
        totalLikes: 0,
      };
    }

    // Hitung Statistik Manual
    const totalSnippets = data.length;

    const totalViews = data.reduce(
      (acc, curr) => acc + (curr.view_count || 0),
      0
    );

    const totalLikes = data.reduce((acc, curr) => {
      // @ts-ignore - Supabase return array of count objects
      const likeCount = curr.likes?.[0]?.count || 0;
      return acc + likeCount;
    }, 0);

    return {
      totalSnippets,
      totalViews,
      totalLikes,
    };
  },
};
