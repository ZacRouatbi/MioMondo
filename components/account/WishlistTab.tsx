"use client";

import { useWishlist } from "@/hooks/useWishlist";
import type { WishlistItem } from "@/types/product";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function WishlistTab({ customerId }: { customerId: number }) {
  const { wishlistItems: items, isLoading, removeFromWishlist } = useWishlist();
  const [page, setPage] = useState(1);

  if (isLoading) {
    return (
      <div className="p-20 text-center">
        <div className="w-8 h-8 border-2 border-[#FFCA68] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-400 text-[14px] font-medium tracking-wide">Chargement de votre sélection…</p>
      </div>
    );
  }

  if (!items.length) {
    
    return (
      <div className="text-center py-16 sm:py-20 bg-white rounded-3xl border border-[#EEEEF5] border-dashed">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F7F7FA] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <p className="text-[15px] sm:text-[16px] font-medium text-jet mb-2">Votre liste est vide</p>
        <p className="text-[12px] sm:text-[13px] text-neutral-400 mb-6 sm:mb-8 max-w-[220px] sm:max-w-[250px] mx-auto">
          Explorez nos collections et enregistrez vos coups de cœur ici.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-jet text-white text-[12px] sm:text-[13px] font-bold rounded-xl hover:bg-[#FFCA68] hover:text-jet transition-all duration-300"
        >
          Découvrir le shop
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        <AnimatePresence mode="popLayout">
          {paginated.map((item: WishlistItem, index) => (
            <motion.div
              key={item.product_id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.28, delay: index * 0.04 }}
              className="bg-white border border-[#EEEEF5] rounded-2xl overflow-hidden relative group transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
            >
              <button
                onClick={() => removeFromWishlist(item.product_id)}
                className="absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-[#EEEEF5] flex items-center justify-center cursor-pointer text-neutral-400 hover:text-red-500 hover:scale-110 transition-all"
                title="Retirer de la liste"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <Link href={`/products/${item.slug}`} className="block">
                <div className="aspect-[4/5] bg-[#F7F7FA] overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-200">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-[12px] sm:text-[13px] font-medium text-jet mb-1 leading-snug line-clamp-1 group-hover:text-[#FFCA68] transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[13px] sm:text-[14px] font-bold text-jet">
                      {item.price ? `${parseFloat(item.price).toLocaleString("fr-TN")} DT` : "—"}
                    </p>
                    <span className="text-[9px] sm:text-[10px] text-[#FFCA68] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="flex items-center gap-1.5 text-[12px] font-bold text-jet disabled:opacity-30 cursor-pointer hover:text-[#FFCA68] transition-colors disabled:cursor-not-allowed"
          >
            <ChevronLeft size={15} /> <span className="hidden sm:inline">Précédent</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              const isNearby = Math.abs(p - page) <= 1 || p === 1 || p === totalPages;
              const isEllipsis = !isNearby && (p === page - 2 || p === page + 2);
              if (isEllipsis) return (
                <span key={i} className="text-[12px] text-neutral-300 px-0.5">…</span>
              );
              if (!isNearby) return null;
              return (
                <button
                  key={i}
                  onClick={() => goToPage(p)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[12px] font-bold transition-all ${
                    page === p
                      ? "bg-jet text-white shadow-md scale-110"
                      : "text-neutral-400 hover:text-jet hover:bg-neutral-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            className="flex items-center gap-1.5 text-[12px] font-bold text-jet disabled:opacity-30 cursor-pointer hover:text-[#FFCA68] transition-colors disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">Suivant</span> <ChevronRight size={15} />
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <p className="text-center text-[11px] text-neutral-300 tracking-wide -mt-2">
          {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, items.length)} sur {items.length} articles
        </p>
      )}
    </div>
  );
}