import type { GetProductsParams, Product, ProductFilters, ProductsPage } from "@/types/product";
import type { CartItem } from "@/types/cart";
import { useQuery } from "@tanstack/react-query";
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


// This hook handles the multi-category logic: if multiple categories are selected, we fetch each separately and merge client-side to avoid WP's "any of these categories" behavior
export function useProducts(filters: ProductFilters, page: number = 1) {
  return useQuery<ProductsPage>({
    queryKey: ["products", filters, page],
    queryFn: () => fetchAllProducts(filters, page),
    staleTime: 60 * 1000,
    placeholderData: (prev) => prev, // keep showing stale data while refetching
  });
}


