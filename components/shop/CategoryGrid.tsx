"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types/product";
import { fetchCategories } from "@/hooks/useCategories";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <div className="flex-[0_0_280px] md:flex-[0_0_300px] lg:flex-[0_0_25%] min-w-0 pl-6">
      <a
        href={`/shop?cat=${cat.slug}`}
        className="group flex flex-col rounded-xl overflow-hidden bg-lavender transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(32,44,57,.12)] h-full"
      >
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          {cat.image ? (
            <img
              src={cat.image.src}
              alt={cat.image.alt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.1]"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-jet/20 uppercase text-[10px] tracking-[.3em] font-sans">
              No Image
            </div>
          )}
        </div>
        <div className="bg-lavender text-jet text-center py-5 px-4 text-[14px] font-medium tracking-widest uppercase border-t border-jet/[0.03] mt-auto">
          {cat.name}
        </div>
      </a>
    </div>
  );
}

export default function CategoryGrid() {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    // --- CACHING SETTINGS ---
  
  // Data stays "fresh" for 60 minutes. 
  // It won't refetch in the background during this window.
  staleTime: 1000 * 60 * 60, 
  
  // How long the data stays in the cache before being deleted (1 hour)
  gcTime: 1000 * 60 * 60,
  
  // Prevents refetching when you switch browser tabs and come back
  refetchOnWindowFocus: false,
  
  // Prevents refetching when the user reconnects to the internet
  refetchOnReconnect: false,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "start",
      containScroll: "trimSnaps" 
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  // New state to track if we actually need arrows
  const [canScroll, setCanScroll] = useState(false);

  const updateScrollability = useCallback((emblaApi: any) => {
    if (!emblaApi) return;
    // scrollSnapList tells us how many "pages" or "stops" exist.
    // If there is only 1 snap, everything fits on one screen.
    setCanScroll(emblaApi.scrollSnapList().length > 1);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    updateScrollability(emblaApi);
    emblaApi.on("reInit", updateScrollability);
    emblaApi.on("resize", updateScrollability);
  }, [emblaApi, updateScrollability, categories]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="bg-snow py-16 lg:py-24">
      <div className="inner">
        <div className="flex items-center justify-between mb-12">
          <h2
            className="text-jet font-normal tracking-tight"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 2.5vw, 2.8rem)" }}
          >
            Shop by Category
          </h2>

          {/* Arrows now only show if canScroll is true */}
          {canScroll && !isLoading && (
            <div className="flex items-center gap-3">
              <button
                onClick={scrollPrev}
                className="p-2.5 rounded-full border border-jet/10 text-jet hover:bg-[#FFCA68] hover:border-[#FFCA68] transition-all duration-300 active:scale-90"
              >
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>
              <button
                onClick={scrollNext}
                className="p-2.5 rounded-full border border-jet/10 text-jet hover:bg-[#FFCA68] hover:border-[#FFCA68] transition-all duration-300 active:scale-90"
              >
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        {/* ... Rest of your Loading/Error/Carousel JSX ... */}
        {isLoading ? (
           <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
             <div key={i} className="min-w-[300px] aspect-square bg-gray-200 rounded-xl animate-pulse" />
           ))}
         </div>
        ) : (
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-6">
              {categories?.map((cat) => (
                <CategoryCard key={cat.id} cat={cat} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}