import { z } from "zod";

export const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") +
  "-" +
  Date.now().toString().slice(-4);

export const snippetSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan strip")
    .or(z.literal(""))
    .optional(),
  description: z.string().optional(),
  content: z.string().min(10, "Kode terlalu pendek"),
  language: z.string().min(1, "Bahasa wajib dipilih"),
  status: z.enum(["draft", "published", "archived"]),
  visibility: z.enum(["public", "private"]),
  tags: z.array(z.string()),
  meta_title: z.string().max(60, "Meta Title maks 60 karakter").optional(),
  meta_description: z
    .string()
    .max(160, "Meta Desc maks 160 karakter")
    .optional(),
  meta_keywords: z.array(z.string()).max(10, "Maksimal 10 keywords").optional(),
});

export type SnippetFormValues = z.infer<typeof snippetSchema>;

export const languageOptions = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "java", label: "Java" },
  { value: "php", label: "PHP" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "plaintext", label: "Plain Text" },
];
