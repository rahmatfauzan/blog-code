import { createClient } from "@/lib/supabase/server";
import { SnippetWithAuthor } from "../types";

export const documents = {
  async getTrending(limit = 6): Promise<SnippetWithAuthor[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("documents")
      .select(
        `
        id,
        title,
        slug,
        description,
        language,
        status,
        visibility,
        view_count,
        author_id,
        created_at,
        author:profiles!author_id (
          full_name,
          username,
          avatar_url
        ),
        document_tags!inner (
          tag:tags (
            name,
            slug
          )
        ),
        likes(count),
        bookmarks(count)
      `
      )
      .eq("status", "published")
      .eq("visibility", "public")
      .order("view_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching trending:", error);
      return [];
    }

    if (!data) return [];

    // ⬇⬇⬇ TARUH DI SINI (bagian transform)
    const transformed: SnippetWithAuthor[] = data.map((doc: any) => ({
      ...doc,

      // Ubah document_tags menjadi array sederhana
      tags: doc.document_tags.map((dt: any) => ({
        name: dt.tag.name,
        slug: dt.tag.slug,
      })),

      // Ubah likes dari array menjadi angka
      likes: doc.likes?.[0]?.count ?? 0,

      // Ubah bookmarks dari array menjadi angka
      bookmarks: doc.bookmarks?.[0]?.count ?? 0,

      // Hapus raw document_tags biar bersih
      document_tags: undefined,
    }));
    // ⬆⬆⬆ END

    return transformed;
  },

  async getBySlug(slug: string): Promise<SnippetWithAuthor | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("documents")
      .select(
        `
       *,
        author:profiles!author_id (
          full_name,
          username,
          avatar_url
        ),
        document_tags!inner (
          tag:tags (
            name,
            slug
          )
        ),
        likes(count),
        bookmarks(count)
      `
      )
      .eq("slug", slug)
      .eq("status", "published") // Pastikan hanya yang published
      .single();

    if (error || !data) {
      return null;
    }

    // Transformasi Data
    const transformed: SnippetWithAuthor = {
      ...data,
      tags: data.document_tags.map((dt: any) => ({
        name: dt.tag.name,
        slug: dt.tag.slug,
      })),
      likes: data.likes?.[0]?.count || 0,
      bookmark: data.bookmarks?.[0]?.count || 0,

      document_tags: undefined,
    };

    return transformed;
  },

  async getPublicDocuments({
    query,
    language,
    authorId,
    page = 1,
    limit = 12,
  }: {
    query?: string;
    language?: string;
    authorId?: string; // ✅ Tambahan: opsional
    page?: number;
    limit?: number;
  }) {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 1. Base Query
    let dbQuery = supabase
      .from("documents")
      .select(
        `
      *,
      author:profiles!author_id ( full_name, username, avatar_url ),
      document_tags!inner ( tag:tags ( name, slug ) ),
      likes(count),
      bookmarks(count)
    `,
        { count: "exact" }
      )
      .eq("status", "published")
      .eq("visibility", "public");

    // 2. Apply Filters Dinamis

    // ✅ Filter by Author ID (jika ada)
    if (authorId) {
      dbQuery = dbQuery.eq("author_id", authorId);
    }

    if (language && language !== "all") {
      dbQuery = dbQuery.eq("language", language);
    }

    if (query) {
      dbQuery = dbQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    // 3. Pagination & Ordering
    const { data, error, count } = await dbQuery
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Explore Error:", error);
      return { data: [], total: 0 };
    }

    // 4. Transform Data
    const transformed = data?.map((doc: any) => ({
      ...doc,
      tags: doc.document_tags.map((dt: any) => dt.tag),
      likes: doc.likes?.[0]?.count || 0,
      bookmarks: doc.bookmarks?.[0]?.count || 0,
      document_tags: undefined,
    })) as any[];

    return { data: transformed, total: count || 0 };
  },

  async getBookmarked(userId: string) {
    const supabase = await createClient();

    // Kita mulai select dari tabel 'bookmarks', lalu join ke 'documents'
    const { data, error } = await supabase
      .from("bookmarks")
      .select(
        `
        document:documents!inner (
          *,
          author:profiles!author_id ( full_name, username, avatar_url ),
          document_tags ( tag:tags ( name, slug ) ),
          likes(count),
          bookmarks(count)
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }); // Bookmark terbaru di atas

    if (error || !data) {
      console.error("Error bookmarks:", error);
      return [];
    }

    // Transformasi Data
    // Karena struktur awalnya: [{ document: { ... } }, { document: { ... } }]
    const transformed = data.map((item: any) => {
      const doc = item.document; // Ambil object document di dalamnya

      return {
        ...doc,
        tags: doc.document_tags.map((dt: any) => dt.tag),
        // SESUAI REQUEST: Pakai 'likes' & 'bookmarks'
        likes: doc.likes?.[0]?.count || 0,
        bookmarks: doc.bookmarks?.[0]?.count || 0,

        document_tags: undefined,
      };
    });

    return transformed;
  },
};
