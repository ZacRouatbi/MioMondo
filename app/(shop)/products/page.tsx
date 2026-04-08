"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductFilters } from "@/types/product";
import {
  useCategoryTree,
  collectDescendantIds,
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

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tree } = useCategoryTree();
  
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const categoryQuery = searchParams.get("category");




  const { data, isLoading, isFetching, error } = useProducts(filters, page);
  const products = data?.products;
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const updateFilters = useCallback(
    (patch: Partial<ProductFilters>) => {
      setFilters((prev) => ({ ...prev, ...patch }));
      
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");


      if (patch.categoryIds) {
        params.delete("category");
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage === 1) params.delete("page");
      else params.set("page", String(newPage));
      router.push(`?${params.toString()}`, { scroll: true });
    },
    [router, searchParams]
  );

  const activeTopLevel = useMemo(() => {
    if (filters.categoryIds.length === 0 || tree.length === 0) return null;

    const selectedRoots = tree.filter((root) => {
      const descendants = collectDescendantIds(root);
      return descendants.some(id => filters.categoryIds.includes(id));
    });

    return selectedRoots.length === 1 ? selectedRoots[0] : null;
  }, [filters.categoryIds, tree]);

  // 5. CHIPS LOGIC
  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    
    tree.forEach((node) => {
      const branchIds = collectDescendantIds(node);
      const isFullBranchSelected = branchIds.length > 0 && 
                                   branchIds.every(id => filters.categoryIds.includes(id));
      
      if (isFullBranchSelected && node.parent === 0) {
        chips.push({
          label: node.name,
          onRemove: () => updateFilters({
            categoryIds: filters.categoryIds.filter(id => !branchIds.includes(id))
          }),
        });
      }
    });

    if (filters.onSaleOnly) chips.push({ label: "En promotion", onRemove: () => updateFilters({ onSaleOnly: false }) });
    if (filters.inStockOnly) chips.push({ label: "En stock", onRemove: () => updateFilters({ inStockOnly: false }) });
    
    return chips;
  }, [filters, tree, updateFilters]);
  useEffect(() => {
    if (tree.length > 0 && !isHydrated) {
      if (categoryQuery) {
        const node = tree.find((n) => n.slug === categoryQuery);
        if (node) {
          const ids = collectDescendantIds(node);
          setFilters(prev => ({ ...prev, categoryIds: ids }));
        }
      }
      setIsHydrated(true);
    }
  }, [tree, categoryQuery, isHydrated]);
  const hasActiveFilters = filters.categoryIds.length > 0 || filters.onSaleOnly || filters.inStockOnly;

  return (
    <div className="min-h-screen bg-snow">
      <MarqueeBanner />
      <Navbar />
      
      <CollectionHero activeTopLevel={activeTopLevel} />

      <div className="sticky top-0 z-30 bg-snow border-b border-[#E6E6FA]/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-3">
          <CategoryTabBar
            roots={tree}
            selectedIds={filters.categoryIds}
            onSelect={(ids) => updateFilters({ categoryIds: ids })}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-10 mt-5 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFiltersOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                hasActiveFilters ? "bg-jet text-white border-jet" : "bg-white text-jet border-[#E6E6FA] hover:bg-[#E6E6FA]/30"
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filtres
            </button>

            {activeChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.onRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFCA68]/15 text-jet border border-[#FFCA68]/30 rounded-full text-xs font-medium"
              >
                {chip.label}
                <span className="ml-1 text-jet/50">×</span>
              </button>
            ))}

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  router.push('/products', { scroll: false });
                }}
                className="text-xs text-jet/40 hover:text-jet underline"
              >
                Tout effacer
              </button>
            )}
          </div>

          {!isLoading && total > 0 && (
            <p className="text-sm text-jet/40">
              <span className="font-semibold text-jet">{total}</span> {total === 1 ? "article" : "articles"}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-20">
        <div className="flex gap-8 items-start">
          <aside className="hidden lg:block w-56 xl:w-64 flex-shrink-0 sticky top-[105px]">
            <ShopFilters filters={filters} onChange={updateFilters} isOpen={false} onClose={() => {}} />
          </aside>

          <div className="lg:hidden">
            <ShopFilters filters={filters} onChange={updateFilters} isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
          </div>

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