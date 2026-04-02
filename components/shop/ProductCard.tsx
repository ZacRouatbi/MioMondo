"use client";

import { useState } from "react";
import { addToCart } from "@/lib/api";
import {Props} from "@/types/product";


export default function ProductCard({ product, variant = "default" }: Props) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      await addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cardBg = variant === "light" ? "bg-white" : "bg-[#F3F4F6]";
  const imgBg = variant === "light" ? "bg-[#F3F4F6]" : "bg-white";

  return (
    <a
      href={`/products/${product.slug}`}
      className={`group flex flex-col h-full rounded-xl overflow-hidden ${cardBg} transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}
    >
      {/* Image Wrapper */}
      <div className={`relative aspect-square overflow-hidden ${imgBg}`}>
        <img
          src={product.images?.[0]?.src || "/placeholder-product.jpg"}
          alt={product.images?.[0]?.alt || product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {product.on_sale && (
          <span className="absolute top-3 left-3 bg-[#202C39] text-[#FFCA68] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm z-10">
            Sale
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col p-5 flex-1">
        {/* Title - min-height ensures prices stay aligned horizontally */}
        <h4
          className="text-[#202C39] leading-tight mb-3 line-clamp-2 min-h-[2.8rem]"
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(16px, 1.2vw, 18px)", 
            fontWeight: 500 
          }}
        >
          {product.name}
        </h4>

        {/* Price Section - Forced TND */}
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-[16px] font-semibold text-[#FFCA68]">
            {product.price} <span className="text-[10px] ml-0.5 uppercase opacity-80">TND</span>
          </span>
          
          {product.on_sale && product.regular_price && (
            <span className="text-[13px] text-[#202C39] opacity-30 line-through font-light">
              {product.regular_price} TND
            </span>
          )}
        </div>

        {/* Button - mt-auto pushes this to the very bottom */}
        <div className="mt-auto">
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`w-full py-3.5 rounded-lg text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 border-0 cursor-pointer
              ${added
                ? "bg-emerald-600 text-white"
                : "bg-[#202C39] text-white hover:bg-[#FFCA68] hover:text-[#202C39]"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : "opacity-100"}
            `}
          >
            {added ? "✓ Added" : loading ? "..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </a>
  );
}