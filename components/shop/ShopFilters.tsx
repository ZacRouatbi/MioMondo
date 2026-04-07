"use client";

import { useCallback, useRef } from "react";
import { useCategoryTree } from "@/hooks/useCategories";
import type { ProductFilters, SortOption } from "@/types/product";
import CategoryTree from "./CategoryTree";

interface Props {
  filters: ProductFilters;
  onChange: (patch: Partial<ProductFilters>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "menu_order", label: "En vedette" },
  { value: "date", label: "Nouveautés" },
  { value: "popularity", label: "Les plus vendus" },
  { value: "price", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 border-b border-lavender/50 last:border-0">
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-jet/40 mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function ShopFilters({ filters, onChange, isOpen, onClose }: Props) {
  const { tree, isLoading } = useCategoryTree();
  
  // Guard against rapid-fire price updates that crash the Next.js router
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the category toggle so CategoryTree doesn't re-render infinitely
  const handleCategoryToggle = useCallback((ids: number[], select: boolean) => {
    const next = select
      ? Array.from(new Set([...filters.categoryIds, ...ids]))
      : filters.categoryIds.filter((id) => !ids.includes(id));
    onChange({ categoryIds: next });
  }, [filters.categoryIds, onChange]);

  // Handle price changes with a tiny debounce to prevent URL "poisoning"
  const handlePriceChange = (key: "minPrice" | "maxPrice", value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    
    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    
    priceTimeoutRef.current = setTimeout(() => {
      onChange({ [key]: numValue });
    }, 300); // 300ms buffer is the sweet spot for Mio Mondo's stability
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-jet/40 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={`
          fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[82vh] overflow-y-auto
          lg:static lg:rounded-none lg:shadow-none lg:max-h-none lg:overflow-visible lg:bg-transparent
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
        `}
      >
        {/* Mobile drag handle + header */}
        <div className="lg:hidden sticky top-0 bg-white pt-3 pb-2 px-5 z-10 border-b border-lavender/40">
          <div className="w-10 h-1 bg-jet/15 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-jet text-base">Filtres</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-lavender/60 text-jet/50 hover:text-jet transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 lg:px-0 pb-6 lg:pb-0">

          {/* ── Sort ── */}
          <FilterSection title="Trier par">
            <div className="space-y-0.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onChange({ sortBy: opt.value })}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-left transition-all ${
                    filters.sortBy === opt.value
                      ? "bg-[#FFCA68]/20 text-jet font-semibold"
                      : "text-jet/60 hover:bg-lavender/50 hover:text-jet"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                    filters.sortBy === opt.value ? "bg-[#FFCA68]" : "bg-jet/20"
                  }`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ── Categories ── */}
          <FilterSection title="Catégories">
            {isLoading ? (
              <div className="space-y-2.5 py-1">
                {[80, 65, 75, 55, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 bg-lavender/60 rounded animate-pulse"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            ) : (
              <>
                <CategoryTree
                  nodes={tree}
                  selectedIds={filters.categoryIds}
                  onToggle={handleCategoryToggle}
                />
                {filters.categoryIds.length > 0 && (
                  <button
                    onClick={() => onChange({ categoryIds: [] })}
                    className="mt-3 text-xs text-jet/40 hover:text-[#FFCA68] underline underline-offset-2 transition-colors"
                  >
                    Effacer la sélection
                  </button>
                )}
              </>
            )}
          </FilterSection>

          {/* ── Price ── */}
          <FilterSection title="Fourchette de prix">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-medium text-jet/40 uppercase tracking-widest block mb-1">Min</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  defaultValue={filters.minPrice ?? ""}
                  onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-offwhite border border-lavender rounded-lg focus:outline-none focus:border-[#FFCA68] focus:ring-2 focus:ring-[#FFCA68]/20 transition-all text-jet placeholder:text-jet/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
              <span className="text-jet/30 text-sm mt-5">—</span>
              <div className="flex-1">
                <label className="text-[10px] font-medium text-jet/40 uppercase tracking-widest block mb-1">Max</label>
                <input
                  type="number"
                  min={0}
                  placeholder="∞"
                  defaultValue={filters.maxPrice ?? ""}
                  onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-offwhite border border-lavender rounded-lg focus:outline-none focus:border-[#FFCA68] focus:ring-2 focus:ring-[#FFCA68]/20 transition-all text-jet placeholder:text-jet/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>
            </div>
          </FilterSection>

          {/* ── Availability ── */}
          <FilterSection title="Disponibilité">
            <div className="space-y-2.5">
              {[
                { id: "inStock", label: "En stock uniquement", checked: filters.inStockOnly, key: "inStockOnly" as const },
                { id: "onSale",  label: "En promotion",         checked: filters.onSaleOnly,  key: "onSaleOnly"  as const },
              ].map(({ id, label, checked, key }) => (
                <label
                  key={id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange({ [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <span className={`relative w-9 h-5 rounded-full flex-shrink-0 transition-colors duration-200 ${
                    checked ? "bg-[#FFCA68]" : "bg-jet/15 group-hover:bg-jet/25"
                  }`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      checked ? "translate-x-4" : ""
                    }`} />
                  </span>
                  <span className={`text-sm transition-colors ${checked ? "text-jet font-medium" : "text-jet/60 group-hover:text-jet"}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

        </div>
      </aside>
    </>
  );
}