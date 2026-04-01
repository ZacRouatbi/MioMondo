"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/shop/ProductCard";
import { fetchBestsellers } from "@/lib/api";
import { MOCK_BESTSELLERS } from "@/lib/mock-data";

const PAGE_SIZE = 4;

export default function BestSellers() {
  const [page, setPage] = useState(0);

  const { data: products } = useQuery({
    queryKey: ["bestsellers"],
    queryFn: fetchBestsellers,
    placeholderData: MOCK_BESTSELLERS,
  });

  const items     = products ?? MOCK_BESTSELLERS;
  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const visible   = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section className="bg-jet py-16 lg:py-20 xl:py-24">
      <div className="inner">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2
            className="text-snow font-normal"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 2.5vw, 2.8rem)" }}
          >
            Best Sellers
          </h2>
          {/* Page indicator dots — top right */}
          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                className={`rounded-full border-0 p-0 cursor-pointer transition-all duration-200 ${
                  i === page
                    ? "w-2.5 h-2.5 bg-gold"
                    : "w-2 h-2 bg-snow opacity-30 hover:opacity-60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product grid — 4 cols on large, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7 xl:gap-8">
          {visible.map(p => (
            <ProductCard key={p.id} product={p} variant="light" />
          ))}
        </div>

        {/* Bottom dots nav */}
        {pageCount > 1 && (
          <div className="flex justify-center gap-2.5 mt-10">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                className={`rounded-full border-0 p-0 cursor-pointer transition-all duration-200 ${
                  i === page ? "w-3 h-3 bg-gold" : "w-2.5 h-2.5 bg-snow opacity-30 hover:opacity-60"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
