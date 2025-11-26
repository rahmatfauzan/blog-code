"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  FileText,
  Hash,
  Code,
  Globe,
  Lock,
  LayoutTemplate,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

// Logic & Validation
import {
  snippetSchema,
  type SnippetFormValues,
  languageOptions,
} from "@/lib/validation/snippet";
import { createSnippet, updateSnippet } from "@/lib/actions/snippets";
import { TagInput } from "./tag-input";
import { AIMetaGenerator } from "./ai-meta-generator";

interface SnippetFormProps {
  initialData?: Partial<SnippetFormValues> & { id: string };
  existingTags?: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
    },
  },
};

export function SnippetForm({
  initialData,
  existingTags = [],
}: SnippetFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tagSuggestions, setTagSuggestions] = useState<string[]>(existingTags);
  const isEditing = !!initialData;

  // Setup Form
  const form = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      content: initialData?.content ?? "",
      language: initialData?.language ?? "javascript",
      status: initialData?.status ?? "draft",
      visibility: initialData?.visibility ?? "public",
      tags: initialData?.tags ?? [],
      meta_title: initialData?.meta_title ?? "",
      meta_description: initialData?.meta_description ?? "",
      meta_keywords: initialData?.meta_keywords ?? [],
    },
  });

  const titleValue = form.watch("title");
  const metaTitleValue = form.watch("meta_title");
  const statusValue = form.watch("status");
  const visibilityValue = form.watch("visibility");
  const languageValue = form.watch("language");
  const currentTags = form.watch("tags");

  // Filter tag suggestions based on current tags and language
  useEffect(() => {
    const languageTags = {
      javascript: ["js", "es6", "node", "frontend", "async"],
      typescript: ["ts", "types", "interface", "generics"],
      python: ["py", "django", "flask", "data-science", "ml"],
      react: ["jsx", "hooks", "components", "state", "props"],
      vue: ["composition", "options-api", "directives"],
      php: ["laravel", "symfony", "composer"],
      java: ["spring", "maven", "jvm"],
      css: ["styles", "responsive", "animations", "flexbox", "grid"],
      html: ["semantic", "forms", "accessibility"],
      sql: ["query", "database", "joins", "postgresql", "mysql"],
      bash: ["shell", "script", "automation", "linux"],
      go: ["golang", "concurrency", "goroutines"],
      rust: ["memory-safe", "performance", "cargo"],
      ruby: ["rails", "gem", "rspec"],
      swift: ["ios", "xcode", "swiftui"],
      kotlin: ["android", "coroutines"],
      dart: ["flutter", "mobile"],
    };

    const suggestionsForLanguage =
      languageTags[languageValue as keyof typeof languageTags] || [];

    const combined = [...new Set([...suggestionsForLanguage, ...existingTags])];
    const filtered = combined.filter((tag) => !currentTags?.includes(tag));

    setTagSuggestions(filtered);
  }, [languageValue, existingTags, currentTags]);

  // Handle Submit
  const onSubmit = (data: SnippetFormValues) => {
    startTransition(async () => {
      try {
        let result;
        if (isEditing && initialData) {
          result = await updateSnippet(initialData.id, data);
        } else {
          result = await createSnippet(data);
        }

        if (result.error) {
          toast.error("Gagal menyimpan", { description: result.error });
        } else {
          toast.success(isEditing ? "Snippet diperbarui" : "Snippet dibuat!");
          router.push("/dashboard/snippets");
          router.refresh();
        }
      } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan sistem");
      }
    });
  };

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {/* STICKY HEADER */}
        <div
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  disabled={isPending}
                  className="h-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4 mr-1" />
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="h-8 bg-white text-indigo-600 hover:bg-white/90 shadow-lg"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-1 h-3 w-3" />
                      {isEditing ? "Update" : "Simpan"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-4">
              {/* Title & Language */}
              <motion.div
                variants={itemVariants}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Judul Snippet{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: React Custom Hook untuk API"
                              className="h-9 text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Bahasa <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {languageOptions.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>

              {/* Code Editor */}
              <motion.div
                variants={itemVariants}
                className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950"
              >
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono ml-2">
                      {languageValue}.code
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs h-5 bg-slate-800 border-slate-700 text-slate-300"
                  >
                    <Code className="h-3 w-3 mr-1" />
                    Editor
                  </Badge>
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="// Tulis kode di sini..."
                          className="min-h-[300px] font-mono text-sm border-0 rounded-none resize-y bg-slate-950 text-slate-100 placeholder:text-slate-600"
                        />
                      </FormControl>
                      <FormMessage className="px-4 pb-2 text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Description */}
              <motion.div
                variants={itemVariants}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Deskripsi
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jelaskan fungsi snippet ini..."
                          className="resize-none h-20 text-sm"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Bantu orang lain memahami snippet Anda
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              {/* Settings Card */}
              <motion.div
                variants={itemVariants}
                className="rounded-lg border border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 p-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      Pengaturan
                    </h3>
                    <Badge
                      variant={
                        visibilityValue === "public" ? "default" : "secondary"
                      }
                      className={
                        visibilityValue === "public"
                          ? "bg-indigo-600 text-white text-xs h-5"
                          : "text-xs h-5"
                      }
                    >
                      {visibilityValue === "public" ? (
                        <>
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Tags
                        </FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value || []}
                            onChange={field.onChange}
                            placeholder="Tambahkan tag..."
                            suggestions={tagSuggestions}
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex justify-between">
                          <span>Maks. 10 tag</span>
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">
                            {field.value?.length || 0}/10
                          </span>
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <Separator className="bg-indigo-200 dark:bg-indigo-800" />

                  {/* Grid Settings */}
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Visibilitas
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="private">
                                <span className="flex items-center gap-1.5">
                                  <Lock className="w-3 h-3" /> Private
                                </span>
                              </SelectItem>
                              <SelectItem value="public">
                                <span className="flex items-center gap-1.5">
                                  <Globe className="w-3 h-3" /> Public
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Status
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">📝 Draft</SelectItem>
                              <SelectItem value="published">
                                ✅ Publish
                              </SelectItem>
                              <SelectItem value="archived">
                                📦 Archive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </motion.div>

              {/* SEO Accordion */}
              <motion.div variants={itemVariants}>
                <Accordion
                  type="single"
                  collapsible
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
                >
                  <AccordionItem value="seo" className="border-0">
                    <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                          <Hash className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold block text-slate-900 dark:text-white">
                            SEO Meta Tags
                          </span>
                          <span className="text-xs text-slate-500">
                            Optimasi pencarian
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-4 space-y-3">
                      <AIMetaGenerator />
                      <Separator />

                      <FormField
                        control={form.control}
                        name="meta_title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Meta Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="h-8 text-xs"
                                placeholder="SEO title..."
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              {metaTitleValue ||
                                titleValue ||
                                "Preview di Google"}
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="meta_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Meta Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="h-16 resize-none text-xs"
                                placeholder="Deskripsi untuk Google..."
                              />
                            </FormControl>
                            <FormDescription className="text-xs flex justify-between">
                              <span>Ideal: 150-160 char</span>
                              <span
                                className={
                                  (field.value?.length || 0) > 160
                                    ? "text-red-500 font-medium"
                                    : "text-indigo-600 dark:text-indigo-400 font-medium"
                                }
                              >
                                {field.value?.length || 0}/160
                              </span>
                            </FormDescription>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="meta_keywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              Meta Keywords
                              <Badge
                                variant="outline"
                                className="text-[10px] h-4 px-1"
                              >
                                Optional
                              </Badge>
                            </FormLabel>
                            <FormControl>
                              <TagInput
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder="keyword..."
                                suggestions={[]}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.form>
    </Form>
  );
}
