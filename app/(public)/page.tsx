export const revalidate = 60;
import { Suspense } from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { TrendingWrapper } from "@/components/landing/trending-wrapper"; // Import wrapper tadi
import { TrendingSkeleton } from "@/components/landing/tranding-skelaton";
export default function HomePage() {
  return (
    <main className="">
      <section className="">
        <HeroSection />
      </section>

      <section className="">
        <Suspense fallback={<TrendingSkeleton />}>
          <TrendingWrapper />
        </Suspense>
      </section>
    </main>
  );
}
