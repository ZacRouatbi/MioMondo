"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { addToCart } from "@/lib/api";

interface Props {
  product: Product;
  variant?: "default" | "light";
}

export default function ProductCard({ product, variant = "default" }: Props) {
  const [added,   setAdded]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try { await addToCart(product.id); } catch {}
    setAdded(true);
    setLoading(false);
    setTimeout(() => setAdded(false), 2200);
  };

  const cardBg = variant === "light" ? "bg-white" : "bg-lavender";
  const imgBg  = variant === "light" ? "bg-lavender" : "bg-snow";

  return (
    <a
      href={`/products/${product.slug}`}
      className={`group flex flex-col rounded-xl overflow-hidden ${cardBg} transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(32,44,57,.14)]`}
    >
      {/* Image */}
      <div className={`relative aspect-square overflow-hidden ${imgBg}`}>
        <img
          src={product.images[0]?.src}
          alt={product.images[0]?.alt || product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        {product.on_sale && (
          <span className="absolute top-3 left-3 bg-jet text-gold text-[9px] font-bold tracking-[.12em] uppercase px-2.5 py-1 rounded-sm">
            Sale
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 pb-5 flex-1">
        <p
          className="text-jet leading-snug"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px,1.3vw,19px)", fontWeight: 500 }}
        >
          {product.name}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-[15px] font-semibold text-gold">${product.price}</span>
          {product.on_sale && product.regular_price && (
            <span className="text-[13px] text-jet opacity-35 line-through">${product.regular_price}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          aria-label={`Add ${product.name} to cart`}
          className={`w-full mt-3 py-3 rounded-lg text-[12px] font-semibold tracking-widest uppercase transition-all duration-200 border-0 cursor-pointer
            ${added
              ? "bg-emerald-700 text-white"
              : "bg-jet text-snow hover:bg-gold hover:text-jet"
            }
            ${loading ? "opacity-60 cursor-default" : ""}`}
        >
          {added ? "✓ Added" : loading ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </a>
  );
}
