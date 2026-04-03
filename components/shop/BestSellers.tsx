"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ProductCard from "@/components/shop/ProductCard";
import { fetchBestsellers } from "@/hooks/useBestsellers";
import { useCartContext } from "@/components/cart/CartContext";
import { productToCartItem } from "@/hooks/useProducts";
import type { Product } from "@/types/product";

const PAGE_SIZE = 4;

export default function BestSellers() {
  const [page, setPage] = useState(0);

  // ── Cart ────────────────────────────────────────────────────────────────────
  const { addItem, cart } = useCartContext();

 
  const cartIds = new Set(cart.items.map((i) => i.id));

  const handleAddToCart = (product: Product) => {
    addItem(productToCartItem(product));
  };

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["bestsellers"],
    queryFn: fetchBestsellers,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const pageCount = products ? Math.ceil(products.length / PAGE_SIZE) : 0;
  const visible = products
    ? products.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    : [];

  // ── Animation variants ──────────────────────────────────────────────────────
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.3 } },
  };

  if (isError) {
    return (
      <div className="text-center py-20 text-snow/50">
        Unable to load bestsellers.
      </div>
    );
  }

  return (
    <section className="bg-jet py-16 lg:py-20 xl:py-24 overflow-hidden">
      <div className="inner">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2
            className="text-snow font-normal text-[clamp(1.8rem,2.5vw,2.8rem)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Best Sellers
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0 || isLoading}
              className="p-2 rounded-full border border-snow/10 transition-all disabled:opacity-10 opacity-60 hover:opacity-100 hover:bg-snow/5"
            >
              <ChevronLeft className="text-snow" size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(p + 1, pageCount - 1))}
              disabled={page === pageCount - 1 || isLoading}
              className="p-2 rounded-full border border-snow/10 transition-all disabled:opacity-10 opacity-60 hover:opacity-100 hover:bg-snow/5"
            >
              <ChevronRight className="text-snow" size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Product Grid / Loader */}
        <div className="min-h-[450px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-gold opacity-50" size={32} />
            </div>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={page}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 items-stretch"
              >
                {visible.map((product: Product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className="flex flex-col h-full"
                  >
                    <ProductCard
                      product={product}
                      variant="light"
                      inCart={cartIds.has(product.id)}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Bottom Dots */}
        {!isLoading && pageCount > 1 && (
          <div className="flex justify-center items-center gap-2.5 mt-12">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="group relative flex items-center justify-center w-6 h-6"
              >
                <span
                  className={`rounded-full transition-all duration-500 ${
                    i === page
                      ? "w-2.5 h-2.5 bg-[#FFCA68]"
                      : "w-1.5 h-1.5 bg-snow opacity-20"
                  }`}
                />
                {i === page && (
                  <span className="absolute inset-0 border border-[#FFCA68]/30 rounded-full animate-ping opacity-10" />
                )}
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}