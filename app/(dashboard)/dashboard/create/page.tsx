import { SnippetForm } from "@/components/snippet/snippets-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Buat Snippet Baru - CodeBox",
};

export default async function CreateSnippetPage() {
  const supabase = await createClient();
  const { data: existingTagsData } = await supabase
    .from("tags")
    .select("name")
    .order("usage_count", { ascending: false });
  const existingTags = existingTagsData?.map((tag) => tag.name) || [];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Halaman */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Buat Snippet Baru
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Bagikan pengetahuan koding Anda kepada dunia atau simpan untuk diri
          sendiri.
        </p>
      </div>

      <SnippetForm existingTags={existingTags} />
    </div>
  );
}
