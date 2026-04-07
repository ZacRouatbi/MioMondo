// hooks/useProduct.ts
"use client";
import { useEffect } from "react";
import type {ProductsPage,ProductFilters } from "@/types/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

function buildProductParams(filters: ProductFilters, page: number): URLSearchParams {
  const params = new URLSearchParams();
 
  params.set("page", String(page));
  params.set("per_page", "12");
 
  if (filters.sortBy) {
    const sortMap: Record<string, { orderby: string; order: string }> = {
      menu_order: { orderby: "menu_order", order: "asc" },
      date: { orderby: "date", order: "desc" },
      popularity: { orderby: "popularity", order: "desc" },
      price: { orderby: "price", order: "asc" },
      "price-desc": { orderby: "price", order: "desc" },
    };
    const sort = sortMap[filters.sortBy] ?? sortMap["menu_order"];
    params.set("orderby", sort.orderby);
    params.set("order", sort.order);
  }
 
  if (filters.categoryIds?.length) {
    // WooCommerce accepts a single category id — use the most specific (last) one
    params.set("category", String(filters.categoryIds[filters.categoryIds.length - 1]));
  }
 
  if (filters.onSaleOnly) params.set("on_sale", "true");
  if (filters.inStockOnly) params.set("stock_status", "instock");
  if (filters.minPrice != null) params.set("min_price", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("max_price", String(filters.maxPrice));
  if (filters.search) params.set("search", filters.search);
 
  return params;
}
 
export function useProducts(filters: ProductFilters, page: number = 1) {
  const queryClient = useQueryClient();
 
  const queryKey = ["products", filters, page] as const;
 
  const result = useQuery<ProductsPage>({
    queryKey,
    queryFn: async () => {
      const params = buildProductParams(filters, page);
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes — avoids refetch on quick filter toggles
    placeholderData: (prev) => prev, // keeps previous page visible while next loads (replaces keepPreviousData in v5)
  });
 
  // Prefetch next page so pagination feels instant
  useEffect(() => {
    if (!result.data) return;
    const { totalPages } = result.data;
    if (page < totalPages) {
      const nextParams = buildProductParams(filters, page + 1);
      queryClient.prefetchQuery({
        queryKey: ["products", filters, page + 1],
        queryFn: async () => {
          const res = await fetch(`/api/products?${nextParams.toString()}`);
          if (!res.ok) throw new Error("Failed to fetch products");
          return res.json();
        },
        staleTime: 1000 * 60 * 2,
      });
    }
  }, [result.data, page, filters, queryClient]);
 
  return result;
}