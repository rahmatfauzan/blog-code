"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  snippetSchema,
  type SnippetFormValues,
} from "@/lib/validation/snippet";

// Helper untuk generate slug
function generateSlug(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Date.now().toString().slice(-4)
  );
}

// Helper untuk upsert tags dan return tag IDs
async function upsertTags(supabase: any, tagNames: string[]) {
  const tagIds: number[] = [];

  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().trim();

    // Check if tag exists
    const { data: existingTag } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingTag) {
      tagIds.push(existingTag.id);
    } else {
      // Create new tag
      const { data: newTag, error } = await supabase
        .from("tags")
        .insert({ name: tagName, slug })
        .select("id")
        .single();

      if (newTag && !error) {
        tagIds.push(newTag.id);
      }
    }
  }

  return tagIds;
}

// Helper untuk sync document_tags junction table
async function syncDocumentTags(
  supabase: any,
  documentId: string,
  tagIds: number[]
) {
  // 1. Delete existing relations
  await supabase.from("document_tags").delete().eq("document_id", documentId);

  // 2. Insert new relations
  if (tagIds.length > 0) {
    const relations = tagIds.map((tagId) => ({
      document_id: documentId,
      tag_id: tagId,
    }));

    await supabase.from("document_tags").insert(relations);
  }
}

// --- 1. CREATE SNIPPET ---
export async function createSnippet(data: SnippetFormValues) {
  const supabase = await createClient();

  // 1. Cek Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // 2. Validasi Zod
  const validated = snippetSchema.safeParse(data);

  if (!validated.success) {
    return { error: "Input tidak valid", details: validated.error.format() };
  }

  // 3. Destructure Data
  const { tags, meta_keywords, slug, ...restData } = validated.data;

  // Generate slug
  const finalSlug = slug || generateSlug(restData.title);

  // 4. Insert Document
  const { data: newDocument, error: docError } = await supabase
    .from("documents")
    .insert({
      ...restData,
      slug: finalSlug,
      meta_keywords: meta_keywords || [], // SEO keywords terpisah
      author_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (docError || !newDocument) {
    console.error("Supabase Insert Error:", docError?.message);
    return { error: docError?.message || "Gagal membuat snippet" };
  }

  // 5. Handle Tags (Junction Table)
  try {
    if (tags && tags.length > 0) {
      const tagIds = await upsertTags(supabase, tags);
      await syncDocumentTags(supabase, newDocument.id, tagIds);
    }
  } catch (tagError: any) {
    console.error("Tag Sync Error:", tagError);
    // Document sudah dibuat, tag gagal (non-critical)
  }

  revalidatePath("/dashboard/snippets");
  return { success: true, id: newDocument.id };
}

// --- 2. UPDATE SNIPPET ---
export async function updateSnippet(id: string, data: SnippetFormValues) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const validated = snippetSchema.safeParse(data);

  if (!validated.success) {
    return { error: "Input tidak valid" };
  }

  const { tags, meta_keywords, slug, ...restData } = validated.data;
  const finalSlug = slug || generateSlug(restData.title);

  // 1. Update Document
  const { error: updateError } = await supabase
    .from("documents")
    .update({
      ...restData,
      slug: finalSlug,
      meta_keywords: meta_keywords || [],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("author_id", user.id);

  if (updateError) {
    console.error("Update Error:", updateError.message);
    return { error: updateError.message };
  }

  // 2. Sync Tags
  try {
    const tagIds = tags ? await upsertTags(supabase, tags) : [];
    await syncDocumentTags(supabase, id, tagIds);
  } catch (tagError: any) {
    console.error("Tag Sync Error:", tagError);
  }

  revalidatePath("/dashboard/snippets");
  revalidatePath(`/snippets/${finalSlug}`);
  return { success: true };
}

// --- 3. DELETE SNIPPET ---
export async function deleteSnippet(snippetId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Delete akan cascade ke document_tags karena foreign key
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", snippetId)
    .eq("author_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/snippets");
  return { success: true };
}

// --- 4. GET POPULAR TAGS (Helper untuk autocomplete) ---
export async function getPopularTags(limit: number = 20) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select("name, slug")
    .order("id", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Get Tags Error:", error);
    return [];
  }

  return data.map((tag) => tag.name);
}
