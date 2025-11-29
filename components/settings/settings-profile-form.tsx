"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Save,
  User,
  Globe,
  Github,
  Linkedin,
  RefreshCcw,
  Mail,
  Lock,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  profileSchema,
  type ProfileFormValues,
} from "@/lib/validation/profile";
import { updateProfile } from "@/lib/actions/profile";
import { Profile } from "@/lib/types";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name || "",
      username: profile.username || "",
      bio: profile.bio || "",
      website: profile.website || "",
      github_url: profile.github_url || "",
      linkedin_url: profile.linkedin_url || "",
      avatar_url:
        profile.avatar_url ||
        `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.username}`,
    },
  });

  const watchedAvatar = form.watch("avatar_url");
  const watchedName = form.watch("full_name") || "User";
  const watchedUsername = form.watch("username");
  const watchedBio = form.watch("bio");

  const handleRandomizeAvatar = (e: React.MouseEvent) => {
    e.preventDefault();
    const randomSeed = Math.random().toString(36).substring(7);
    const newUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${randomSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    form.setValue("avatar_url", newUrl, { shouldDirty: true });
  };

  const onSubmit = (data: ProfileFormValues) => {
    startTransition(async () => {
      try {
        const result = await updateProfile(data);
        if (result.error) {
          toast.error("Gagal menyimpan", { description: result.error });
        } else {
          toast.success("Profil berhasil diperbarui!");
        }
      } catch (err) {
        toast.error("Terjadi kesalahan sistem");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Profile Preview Section */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-slate-100 dark:ring-slate-800 transition-all group-hover:ring-indigo-200 dark:group-hover:ring-indigo-900">
                    <AvatarImage src={watchedAvatar} className="object-cover" />
                    <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 text-indigo-700 dark:text-indigo-300">
                      {watchedName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 shadow-lg ring-4 ring-white dark:ring-slate-900">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Info & Actions */}
              <div className="flex-1 min-w-0 space-y-3 sm:space-y-4 text-center sm:text-left w-full">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                    {watchedName}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    @{watchedUsername}
                  </p>
                  {watchedBio && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                      {watchedBio}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRandomizeAvatar}
                    className="gap-1.5 group w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <RefreshCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    Acak Avatar
                  </Button>
                  <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    <ImageIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-1" />
                    Avatar dari DiceBear
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950 rounded-md">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-base">
                  Informasi Personal
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Nama Lengkap
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            className="h-9 sm:h-10 text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Username
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                              @
                            </span>
                            <Input
                              {...field}
                              placeholder="johndoe"
                              className="h-9 sm:h-10 pl-7 text-sm"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Ceritakan tentang diri Anda..."
                          className="resize-none h-20 sm:h-24 text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-[10px] sm:text-xs">
                        {field.value?.length || 0}/500 karakter
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="bg-slate-200 dark:bg-slate-800" />

            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-950 rounded-md">
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-base">
                  Link & Sosial Media
                </h3>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-xs sm:text-sm">
                        <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                        Website Personal
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://yourwebsite.com"
                          className="h-9 sm:h-10 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm">
                          <Github className="w-3.5 h-3.5 text-slate-400" />
                          GitHub
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://github.com/username"
                            className="h-10 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm">
                          <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                          LinkedIn
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            className="h-10 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
            className="text-slate-600 dark:text-slate-400 w-full sm:w-auto"
          >
            Reset Perubahan
          </Button>

          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>

        {/* Info Footer */}
        {form.formState.isDirty && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300">
            <span className="font-medium">
              Ada perubahan yang belum disimpan.
            </span>{" "}
            Klik "Simpan Perubahan" untuk menyimpan.
          </div>
        )}
      </form>
    </Form>
  );
}
