import { createClient } from "@/lib/supabase/server";
import { documents } from "@/lib/queries/documents";
import { SnippetListManager } from "@/components/snippet/snippets-list-manager";

export const metadata = {
  title: "My Snippets | Dashboard",
};

interface PageProps {
  // Hapus 'view' dari searchParams karena sekarang dihandle client-side
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function MySnippetsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const page = Number(params.page) || 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Data
  const { data: snippets, total } = await documents.getMyDocuments({
    userId: user.id,
    query,
    page,
    limit: 12,
  });

  // Render Client Component
  return <SnippetListManager snippets={snippets} total={total} query={query} />;
}
