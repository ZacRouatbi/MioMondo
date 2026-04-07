"use client";

import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";


interface Props {
  products: Product[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  // Pagination
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-4/5 bg-lavender/40" />
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 bg-lavender/60 rounded-full w-1/3" />
        <div className="h-4 bg-lavender/60 rounded-full w-4/5" />
        <div className="h-4 bg-lavender/40 rounded-full w-3/5" />
        <div className="h-5 bg-lavender/60 rounded-full w-2/5 mt-1" />
      </div>
      <div className="mx-4 mb-4 h-9 bg-lavender/40 rounded-xl" />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  isFetching,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  isFetching: boolean;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const getPageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isFetching}
        aria-label="Page précédente"
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E6E6FA]/80 bg-white text-jet/60 hover:bg-[#E6E6FA]/40 hover:text-jet disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-jet/30 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={isFetching}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all
              ${p === page
                ? "bg-jet text-white shadow-sm"
                : "border border-[#E6E6FA]/80 bg-white text-jet/70 hover:bg-[#E6E6FA]/40 hover:text-jet disabled:opacity-50"
              }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || isFetching}
        aria-label="Page suivante"
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E6E6FA]/80 bg-white text-jet/60 hover:bg-[#E6E6FA]/40 hover:text-jet disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

export default function ProductGrid({
  products,
  isLoading,
  isFetching,
  error,
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-jet mb-1">Erreur de chargement</p>
          <p className="text-sm text-jet/50">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-lavender/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-jet/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-jet mb-1">Aucun produit trouvé</p>
          <p className="text-sm text-jet/50">Essayez d'ajuster ou supprimer vos filtres.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 transition-opacity duration-200 ${
          isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="light" />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        isFetching={isFetching}
        onPageChange={onPageChange}
      />
    </div>
  );
}