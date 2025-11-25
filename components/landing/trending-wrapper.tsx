import { documents } from "@/lib/queries/documents";
import { TrendingSection } from "./trending-section";

// Komponen ini async, dia yang akan "menahan" loading
export async function TrendingWrapper() {
  // Di sini proses "berat" terjadi
  const trendingDocuments = await documents.getTrending();

  return <TrendingSection trendingSnippets={trendingDocuments} />;
}
