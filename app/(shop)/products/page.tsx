"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductFilters } from "@/types/product";
import {
  useCategoryTree,
  collectDescendantIds,
  findNodeById,
} from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductGrid from "@/components/shop/ProductGrid";
import CategoryTabBar from "@/components/shop/CategoryTabbar";
import Navbar from "@/components/layout/Navbar";
import MarqueeBanner from "@/components/layout/MarqueeBanner";
import CollectionHero from "@/components/shop/CollectionHero";
import Footer from "@/components/layout/Footer";
const DEFAULT_FILTERS: ProductFilters = {
  categoryIds: [],
  onSaleOnly: false,
  inStockOnly: false,
  sortBy: "menu_order",
  search: "",
};
export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") ?? "1", 10);

  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading, isFetching, error } = useProducts(filters, page);
  const products = data?.products;
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const { tree } = useCategoryTree();

  
  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) {
        params.delete("page");
      } else {
        params.set("page", String(newPage));
      }
      router.push(`?${params.toString()}`, { scroll: true });
    },
    [router, searchParams]
  );

  // Reset to page 1 whenever filters change
  const updateFilters = useCallback(
    (patch: Partial<ProductFilters>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      // Reset to page 1 on filter change
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // ── Active filter chips ──────────────────────────────────────────────────
  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    const topLevelSelected = tree.filter((n) =>
      filters.categoryIds.includes(n.id)
    );
    const isSingleTopLevelOnly =
      topLevelSelected.length === 1 &&
      filters.categoryIds.length ===
        collectDescendantIds(topLevelSelected[0]).length;

    if (!isSingleTopLevelOnly) {
      filters.categoryIds.forEach((id) => {
        const node = findNodeById(tree, id);
        if (node && node.parent === 0) {
          chips.push({
            label: node.name,
            onRemove: () =>
              updateFilters({
                categoryIds: filters.categoryIds.filter(
                  (cid) => !collectDescendantIds(node).includes(cid)
                ),
              }),
          });
        }
      });
    }

    if (filters.onSaleOnly)
      chips.push({
        label: "En promotion",
        onRemove: () => updateFilters({ onSaleOnly: false }),
      });
    if (filters.inStockOnly)
      chips.push({
        label: "En stock",
        onRemove: () => updateFilters({ inStockOnly: false }),
      });
    if (filters.minPrice != null)
      chips.push({
        label: `Dès ${filters.minPrice} DT`,
        onRemove: () => updateFilters({ minPrice: undefined }),
      });
    if (filters.maxPrice != null)
      chips.push({
        label: `Max ${filters.maxPrice} DT`,
        onRemove: () => updateFilters({ maxPrice: undefined }),
      });
    if (filters.sortBy !== "menu_order") {
      const labels: Record<string, string> = {
        date: "Nouveautés",
        popularity: "Plus vendus",
        price: "Prix ↑",
        "price-desc": "Prix ↓",
      };
      chips.push({
        label: labels[filters.sortBy] ?? filters.sortBy,
        onRemove: () => updateFilters({ sortBy: "menu_order" }),
      });
    }

    return chips;
  }, [filters, tree, updateFilters]);

  const hasActiveFilters =
    filters.categoryIds.length > 0 ||
    filters.onSaleOnly ||
    filters.inStockOnly ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.sortBy !== "menu_order" ||
    filters.search !== "";

  const activeTopLevel = useMemo(() => {
    if (filters.categoryIds.length === 0) return null;
    const topSelected = tree.find((n) => filters.categoryIds.includes(n.id));
    return topSelected ?? null;
  }, [filters.categoryIds, tree]);

  return (
    <div className="min-h-screen bg-snow">
      <MarqueeBanner />
      <Navbar />
      <CollectionHero activeTopLevel={activeTopLevel} />

      {/* ── Category Tabs ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-snow border-b border-[#E6E6FA]/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-3">
          <CategoryTabBar
            roots={tree}
            selectedIds={filters.categoryIds}
            onSelect={(ids) => updateFilters({ categoryIds: ids })}
          />
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 mt-5 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter button */}
            <button
              onClick={() => setFiltersOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                hasActiveFilters
                  ? "bg-jet text-white border-jet"
                  : "bg-white text-jet border-[##E6E6FA] hover:border-jet/40 hover:bg-[#E6E6FA]/30"
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filtres
              {activeChips.length > 0 && (
                <span className="bg-[#FFCA68] text-jet text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeChips.length}
                </span>
              )}
            </button>

            {/* Active chips */}
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.onRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFCA68]/15 text-jet border border-[#FFCA68]/30 rounded-full text-xs font-medium hover:bg-[#FFCA68]/30 transition-colors"
              >
                {chip.label}
                <svg className="w-3 h-3 text-jet/50" viewBox="0 0 12 12" fill="none">
                  <line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            ))}

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  handlePageChange(1);
                }}
                className="text-xs text-jet/40 hover:text-jet underline underline-offset-2 transition-colors"
              >
                Tout effacer
              </button>
            )}
          </div>

          {/* Product count + page indicator */}
          {!isLoading && total > 0 && (
            <p className="text-sm text-jet/40">
              <span className="font-semibold text-jet">{total}</span>{" "}
              {total === 1 ? "article" : "articles"}
              {totalPages > 1 && (
                <span className="ml-1">
                  · page <span className="font-semibold text-jet">{page}</span> / {totalPages}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* ── Main layout ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-20">
        <div className="flex gap-8 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0 sticky top-[105px]">
            <ShopFilters
              filters={filters}
              onChange={updateFilters}
              isOpen={false}
              onClose={() => {}}
            />
          </div>

          {/* Mobile drawer */}
          <div className="lg:hidden">
            <ShopFilters
              filters={filters}
              onChange={updateFilters}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
            />
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isFetching={isFetching}
              error={error}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}