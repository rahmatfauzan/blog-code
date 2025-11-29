import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SnippetFormValues } from "@/lib/validation/snippet";
import { SnippetForm } from "@/components/snippet/snippets-form";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Snippet - CodeBox",
};

export default async function EditSnippetPage({ params }: EditPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Snippet yang mau diedit
  const { data: snippet, error } = await supabase
    .from("documents")
    .select(
      `
      *,
      document_tags (
        tag:tags (name)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !snippet) {
    return notFound();
  }

  // 2. Fetch Semua Tags untuk Suggestion (Autocomplete)
  const { data: existingTagsData } = await supabase
    .from("tags")
    .select("name")
    .order("usage_count", { ascending: false });

  const existingTags = existingTagsData?.map((tag) => tag.name) || [];

  // 3. Transformasi Data agar sesuai dengan SnippetFormValues
  // Database mengembalikan tags sebagai object, kita butuh array string ["react", "hooks"]
  const formattedTags = snippet.document_tags.map((dt: any) => dt.tag.name);

  const initialData: SnippetFormValues & { id: string } = {
    id: snippet.id,
    title: snippet.title,
    slug: snippet.slug,
    description: snippet.description || "",
    content: snippet.content || "",
    language: snippet.language,
    status: snippet.status,
    visibility: snippet.visibility,
    tags: formattedTags,
    meta_title: snippet.meta_title || "",
    meta_description: snippet.meta_description || "",
    meta_keywords: snippet.meta_keywords || [],
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Edit Snippet
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Perbarui konten, tag, atau pengaturan snippet Anda.
        </p>
      </div>

      {/* Form dengan Initial Data */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <SnippetForm initialData={initialData} existingTags={existingTags} />
      </div>
    </div>
  );
}
