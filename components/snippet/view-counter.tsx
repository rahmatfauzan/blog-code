"use client";

import { useEffect, useRef } from "react";
import { incrementView } from "@/lib/actions/interaction";

export function ViewCounter({ documentId }: { documentId: string }) {
  // Gunakan ref agar tidak double count di React Strict Mode (Development)
  const hasViewed = useRef(false);

  useEffect(() => {
    if (!hasViewed.current) {
      incrementView(documentId);
      hasViewed.current = true;
    }
  }, [documentId]);

  return null; // Komponen ini tidak merender apa-apa di layar
}
