// app/page.tsx
import { HeroSection } from "@/components/landing/hero-section";
import { TrendingSection } from "@/components/landing/trending-section";
import { documents } from "@/lib/queries/documents";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const trendingDocuments = await documents.getTrending();
  console.log("Trending Documents:", trendingDocuments);
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrendingSection trendingSnippets={trendingDocuments} />
    </main>
  );
}
