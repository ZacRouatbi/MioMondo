"use client";

import { useState } from "react";

export function ImageGallery({
  images,
}: {
  images: { id: number; src: string; alt: string }[];
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-[#E6E6FA]/40 flex items-center justify-center">
        <svg className="w-16 h-16 text-jet/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-4 lg:sticky lg:top-6 lg:self-start">
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden bg-[#F8F8F8] aspect-square cursor-zoom-in group"
        onClick={() => setZoomed(true)}
      >
        <img
          src={images[active]?.src}
          alt={images[active]?.alt || "Product image"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-3.5 h-3.5 text-jet/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[10px] font-semibold text-jet/60 tracking-wide">Agrandir</span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                i === active ? "ring-2 ring-[#FFCA68] ring-offset-2" : "opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-jet/90 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10"
          onClick={() => setZoomed(false)}
        >
          <img
            src={images[active]?.src}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}