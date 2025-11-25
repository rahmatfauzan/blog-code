export const revalidate = 60;
import { Suspense } from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { TrendingWrapper } from "@/components/landing/trending-wrapper"; // Import wrapper tadi
import { TrendingSkeleton } from "@/components/landing/tranding-skelaton";
export default function HomePage() {
  return (
    <main className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
      {/* 1. Hero Section (Muncul Instan karena Statis) */}
      <div className="snap-start min-h-screen">
        <HeroSection />
      </div>

      {/* 2. Trending Section (Loading Async) */}
      <div id="trending" className="snap-start min-h-screen">
        {/* MAGIC NYA DI SINI: 
           Next.js akan menampilkan 'fallback' (Skeleton) dulu.
           Setelah data database siap, dia otomatis ganti jadi TrendingWrapper.
        */}
        <Suspense fallback={<TrendingSkeleton />}>
          <TrendingWrapper />
        </Suspense>
      </div>
    </main>
  );
}
