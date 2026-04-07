import type { GetProductsParams, Product, ProductFilters, ProductsPage } from "@/types/product";
import type { CartItem } from "@/types/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
export function productToCartItem(
  product: Product,
  quantity = 1,
  variant?: string,
  variationId?: number
): CartItem {
  return {
    id: product.id,
    variationId,
    name: product.name,
    slug: product.slug,
    category: product.categories?.[0]?.name ?? "",
    price: parseFloat(product.price) || 0,
    regularPrice: parseFloat(product.regular_price) || 0,
    salePrice: product.sale_price ? parseFloat(product.sale_price) : null,
    onSale: product.on_sale,
    quantity,
    image: product.image,   // already string | null — no transform needed
    variant,
    sku: product.sku,
  };
}
async function fetchAllProducts(filters: ProductFilters, page: number): Promise<ProductsPage> {
  // No category filter → fetch all
  if (filters.categoryIds.length === 0) {
    return fetchProductsForCategory(0, { ...filters, categoryIds: [] }, page);
  }
 
  // Multiple categories → fetch in parallel, deduplicate
  const results = await Promise.all(
    filters.categoryIds.map((id) => fetchProductsForCategory(id, filters, page))
  );
 
  const seen = new Set<number>();
  const deduplicatedProducts = results.flatMap((r) => r.products).filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  // Calculate pagination based on total from first result
  const total = results[0]?.total || 0;
  const perPage = 48;
  const totalPages = Math.ceil(total / perPage);

  return {
    products: deduplicatedProducts,
    total,
    totalPages,
  };
}
async function fetchProductsForCategory(
  categoryId: number,
  filters: ProductFilters,
  page: number
): Promise<ProductsPage> {
  const params = new URLSearchParams();
  if (categoryId !== 0) params.set("category", String(categoryId));
  params.set("per_page", "48");
  params.set("page", String(page));
 
  const [orderby, order] =
    filters.sortBy === "price-desc"
      ? ["price", "desc"]
      : [filters.sortBy, "asc"];
 
  params.set("orderby", orderby);
  params.set("order", order);
 
  if (filters.onSaleOnly)         params.set("on_sale", "true");
  if (filters.inStockOnly)        params.set("stock_status", "instock");
  if (filters.minPrice != null)   params.set("min_price", String(filters.minPrice));
  if (filters.maxPrice != null)   params.set("max_price", String(filters.maxPrice));
  if (filters.search)             params.set("search", filters.search);
 
  const res = await fetch(`/api/products?${params}`);
  if (!res.ok) throw new Error("Failed to load products");
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

