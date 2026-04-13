"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useMemo } from "react";

export function WishlistButton({ productId }: { productId: number }) {
  const { 
    wishlistItems, 
    addToWishlist, 
    removeFromWishlist, 
    isAdding, 
    isRemoving 
  } = useWishlist();

  // We memoize the status check to ensure it's efficient during re-renders
  const isActive = useMemo(() => {
    return wishlistItems.some((item) => Number(item.product_id) === productId);
  }, [wishlistItems, productId]);

  // Combined loading state to disable the button during network activity
  const isPending = isAdding || isRemoving;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    if (isPending) return;

    if (isActive) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
      console.log("ADDING PRODUCT ID:", productId);
      
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isActive ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`w-12 h-12 sm:w-14 sm:h-12 rounded-xl border transition-all duration-300 flex items-center justify-center flex-shrink-0 group ${
        isActive
          ? "bg-[#FFCA68]/20 border-[#FFCA68] text-jet shadow-sm"
          : "bg-white border-[#E6E6FA] text-jet/40 hover:border-[#FFCA68] hover:text-jet"
      } ${isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-200 ${
          isActive ? "scale-110" : "group-hover:scale-110"
        }`}
        viewBox="0 0 24 24"
        fill={isActive ? "#FFCA68" : "none"}
        stroke={isActive ? "#FFCA68" : "currentColor"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}