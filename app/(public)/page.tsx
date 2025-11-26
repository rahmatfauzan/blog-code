export const revalidate = 60;
import { Suspense } from "react";
import { TrendingWrapper } from "@/components/landing/trending-wrapper"; // Import wrapper tadi
import { TrendingSkeleton } from "@/components/landing/tranding-skelaton";
import HeroSection from "@/components/landing/hero-section";
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
