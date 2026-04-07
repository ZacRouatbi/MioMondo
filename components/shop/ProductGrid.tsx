"use client";

import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
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

export default function ProductGrid({ products, isLoading, isFetching, error }: Props) {
  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/>
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
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-lavender/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-jet/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
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
    <div className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 transition-opacity duration-200 ${
      isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
    }`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="light" />
      ))}
    </div>
  );
}