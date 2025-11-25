import { Database } from "./types";

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];

// 2. ALIAS TABEL (Shortcut)
export type Document = Tables<"documents">;
export type DocumentInsert = TablesInsert<"documents">;
export type DocumentUpdate = TablesUpdate<"documents">;

export type Profile = Tables<"profiles">;
export type ProfileInsert = TablesInsert<"profiles">;
export type ProfileUpdate = TablesUpdate<"profiles">;

export type Tag = Tables<"tags">;
export type TagInsert = TablesInsert<"tags">;

export type SnippetWithAuthor = Document & {
  author: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    is_verified?: boolean;
  } | null;

  tags: {
    name: string;
    slug: string;
  }[];
  likes?: number;
  bookmark?: number;
};

export type DashboardStats = {
  totalSnippets: number;
  totalViews: number;
  totalLikes: number;
};
