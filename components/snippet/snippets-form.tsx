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
  Sparkles,
  Tag,
  X,
  Trash2,
  AlertTriangle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Logic & Validation
import {
  snippetSchema,
  type SnippetFormValues,
  languageOptions,
} from "@/lib/validation/snippet";
import {
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from "@/lib/actions/snippets";
import { TagInput } from "./tag-input";
import { AIMetaGenerator } from "./ai-meta-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CodeEditor } from "../ui/code-editor";
import { highlight } from "prismjs";
import { CodeViewer } from "../shared/code-viewer";

interface SnippetFormProps {
  initialData?: Partial<SnippetFormValues> & { id: string };
  existingTags?: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { y: 8, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 150,
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
  const [isDeleting, setIsDeleting] = useState(false);
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
  const languageValue = form.watch("language");
  const currentTags = form.watch("tags");
  const descriptionValue = form.watch("description");
  const visibilityValue = form.watch("visibility");
  const contentValue = form.watch("content");

  // Filter tag suggestions
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

  // Handle Delete
  const handleDelete = async () => {
    if (!initialData?.id) return;

    setIsDeleting(true);
    try {
      const result = await deleteSnippet(initialData.id);
      if (result.error) {
        toast.error("Gagal menghapus", { description: result.error });
      } else {
        toast.success("Snippet berhasil dihapus");
        router.push("/dashboard/snippets");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Form {...form}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto p-4 space-y-3"
      >
        {/* Action Buttons - Right Aligned */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-2"
        >
          {isEditing && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending || isDeleting}
                  className="h-8 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Hapus Snippet?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Snippet akan dihapus
                    secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menghapus...
                      </>
                    ) : (
                      "Ya, Hapus"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            disabled={isPending || isDeleting}
            className="h-8"
          >
            <X className="h-3.5 w-3.5 mr-1.5" />
            Batal
          </Button>

          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            size="sm"
            disabled={isPending || isDeleting}
            className="h-8"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {isEditing ? "Update" : "Simpan"}
              </>
            )}
          </Button>
        </motion.div>

        {/* Main Content - 2 Column Compact */}
        <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
          {/* LEFT COLUMN */}
          <div className="space-y-3">
            {/* Title & Language - Inline */}
            <motion.div
              variants={itemVariants}
              className="rounded-lg border p-3"
            >
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs font-medium">
                        Judul <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nama snippet..."
                          className="h-8 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel className="text-xs font-medium">
                        Bahasa <span className="text-red-500">*</span>
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
                          {languageOptions.map((lang) => (
                            <SelectItem
                              key={lang.value}
                              value={lang.value}
                              className="text-xs"
                            >
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

            {/* Description - Compact */}
            <motion.div
              variants={itemVariants}
              className="rounded-lg border  p-3"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Deskripsi
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jelaskan fungsi snippet..."
                        className="resize-none h-16 text-xs"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-xs flex justify-between">
                      <span className="text-muted-foreground">Opsional</span>
                      <span className="text-muted-foreground">
                        {descriptionValue?.length || 0}
                      </span>
                    </FormDescription>
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Code Editor - Compact */}
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel>Kode</FormLabel>
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px]"
                      >
                        Markdown Supported
                      </Badge>
                    </div>

                    <FormControl>
                      <Tabs defaultValue="write" className="w-full">
                        <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 h-9">
                          <TabsTrigger
                            value="write"
                            className="text-xs h-8 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-none data-[state=active]:shadow-sm"
                          >
                            Write
                          </TabsTrigger>
                          <TabsTrigger
                            value="preview"
                            className="text-xs h-8 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-none data-[state=active]:shadow-sm"
                          >
                            Preview
                          </TabsTrigger>
                        </TabsList>

                        {/* TAB WRITE (Editor) */}
                        <TabsContent value="write" className="mt-2">
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="// Code here..."
                                    className="min-h-[300px] font-mono text-xs border-0 rounded-none resize-y bg-slate-950 text-slate-100 placeholder:text-slate-600 focus-visible:ring-0"
                                  />
                                </FormControl>
                                <FormMessage className="px-3 pb-2 text-xs" />
                              </FormItem>
                            )}
                          />
                        </TabsContent>

                        {/* TAB PREVIEW (Render Hasil) */}
                        <TabsContent value="preview" className="mt-2">
                          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden min-h-[400px] bg-white dark:bg-slate-950">
                            {contentValue ? (
                              // Gunakan CodeViewer untuk merender Markdown/Code
                              <CodeViewer
                                code={contentValue}
                                language={languageValue}
                                className="p-6 border-none shadow-none" // Reset style agar pas di form
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                                <p className="text-sm">
                                  Belum ada konten untuk dipreview
                                </p>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN - Sidebar */}
          <div className="space-y-3">
            {/* Settings - Compact */}
            <motion.div
              variants={itemVariants}
              className="rounded-lg border  p-3"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    Pengaturan
                  </h3>
                  <Badge
                    variant={
                      visibilityValue === "public" ? "default" : "secondary"
                    }
                    className="text-[10px] h-5"
                  >
                    {visibilityValue === "public" ? (
                      <>
                        <Globe className="h-2.5 w-2.5 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-2.5 w-2.5 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-medium">
                          Visibilitas
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-7 text-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="private" className="text-xs">
                              <span className="flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" /> Private
                              </span>
                            </SelectItem>
                            <SelectItem value="public" className="text-xs">
                              <span className="flex items-center gap-1">
                                <Globe className="w-2.5 h-2.5" /> Public
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
                        <FormLabel className="text-[10px] font-medium">
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-7 text-[10px]">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft" className="text-xs">
                              📝 Draft
                            </SelectItem>
                            <SelectItem value="published" className="text-xs">
                              ✅ Published
                            </SelectItem>
                            <SelectItem value="archived" className="text-xs">
                              📦 Archived
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-medium flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Tags
                      </FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="tag..."
                          suggestions={tagSuggestions}
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] flex justify-between">
                        <span>Maks. 10</span>
                        <span
                          className={`font-medium ${
                            (field.value?.length || 0) >= 10
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          {field.value?.length || 0}/10
                        </span>
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            {/* SEO - Compact Accordion */}
            <motion.div variants={itemVariants}>
              <Accordion
                type="single"
                collapsible
                className="rounded-lg border "
              >
                <AccordionItem value="seo" className="border-0">
                  <AccordionTrigger className="px-3 py-2 hover:bg-slate-800/50 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Hash className="h-3 w-3 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-semibold block">SEO</span>
                        <span className="text-[10px] text-muted-foreground">
                          Meta tags
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-3 pb-3 space-y-2.5">
                    <AIMetaGenerator />
                    <Separator />

                    <FormField
                      control={form.control}
                      name="meta_title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-medium">
                            Meta Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-7 text-xs"
                              placeholder="SEO title..."
                            />
                          </FormControl>
                          <FormDescription className="text-[10px]">
                            {metaTitleValue || titleValue || "Preview"}
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="meta_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-medium">
                            Meta Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="h-14 resize-none text-xs"
                              placeholder="SEO description..."
                            />
                          </FormControl>
                          <FormDescription className="text-[10px] flex justify-between">
                            <span>150-160 char</span>
                            <span
                              className={
                                (field.value?.length || 0) > 160
                                  ? "text-red-500"
                                  : ""
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
                          <FormLabel className="text-[10px] font-medium flex items-center gap-1">
                            Keywords
                            <Badge
                              variant="outline"
                              className="text-[9px] h-3.5 px-1"
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
      </motion.div>
    </Form>
  );
}
