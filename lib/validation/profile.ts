import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(20, "Username maksimal 20 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh huruf, angka, dan underscore (_)"
    ),

  full_name: z
    .string()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(50, "Nama lengkap maksimal 50 karakter"),

  // TAMBAHAN AVATAR URL
  avatar_url: z
    .string()
    .url("URL Avatar tidak valid")
    .optional()
    .or(z.literal("")),

  bio: z.string().max(500, "Bio maksimal 500 karakter").optional(),

  website: z.string().url("URL tidak valid").optional().or(z.literal("")),
  github_url: z
    .string()
    .url("URL GitHub tidak valid")
    .optional()
    .or(z.literal("")),
  linkedin_url: z
    .string()
    .url("URL LinkedIn tidak valid")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
