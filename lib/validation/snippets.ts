import { z } from "zod"

// 1. Definisikan array sebagai Readonly Tuple yang Valid untuk Zod
// Kita pakai 'as const' agar nilainya fix
const LANGUAGES = [
  "typescript",
  "javascript",
  "python",
  "go",
  "rust",
  "java",
  "php",
  "html",
  "css",
  "sql",
  "plaintext"
] as const;

// 2. Buat Tipe ZodEnum dari array tersebut
// Ini cara paling aman agar tidak error 'Overload'
const languageEnum = z.enum(LANGUAGES);

export const snippetSchema = z.object({
  title: z
    .string()
    .min(3, "Judul terlalu pendek (min. 3 karakter)")
    .max(100, "Judul kepanjangan (max. 100 karakter)"),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)")
    .min(3, "Slug terlalu pendek")
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .max(300, "Deskripsi maksimal 300 karakter")
    .optional(),

  content: z
    .string()
    .min(10, "Konten kode terlalu sedikit, ayo tulis lebih banyak!"),

  language: languageEnum.default("plaintext"), 

  tags: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(2, "Tag minimal 2 huruf")
      })
    )
    .max(5, "Maksimal 5 tag per snippet")
    .optional(),

  status: z.enum(["draft", "published", "archived"]).default("draft"),
  visibility: z.enum(["public", "private"]).default("public"),
})

export type SnippetFormValues = z.infer<typeof snippetSchema>

// Helper untuk Frontend (biar bisa dipakai di Select Option)
export const languageOptions = LANGUAGES.map(lang => ({
  value: lang,
  label: lang.charAt(0).toUpperCase() + lang.slice(1) // Capitalize (python -> Python)
}))