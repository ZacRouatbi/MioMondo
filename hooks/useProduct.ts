// hooks/useProduct.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import type { WCRawProduct } from "@/types/product";

// The full product shape returned by /api/products/[slug]
// Extends WCRawProduct with the top-level `image` field the rest of the app uses
export type FullProduct = WCRawProduct & {
  image: string | null;
  images: { id: number; src: string; alt: string }[];
};

async function fetchProduct(slug: string): Promise<FullProduct> {
  const res = await fetch(`/api/products/${slug}`);
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("Failed to load product");
  return res.json();
}

export function useProduct(slug: string) {
  return useQuery<FullProduct>({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    staleTime: 60 * 1000,
    retry: (count, err) => {
      // Don't retry 404s
      if (err instanceof Error && err.message === "NOT_FOUND") return false;
      return count < 2;
    },
  });
}