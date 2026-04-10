"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { useCartContext } from "@/components/cart/CartContext";
import { productToCartItem } from "@/hooks/useProducts";
import Navbar from "@/components/layout/Navbar";
import MarqueeBanner from "@/components/layout/MarqueeBanner";

// Sub-components
import { ImageGallery } from "@/components/product/ImageGallery";
import { StockBadge, PriceDisplay, TrustBadges } from "@/components/product/ProductDetails";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug);
  const { addItem } = useCartContext();

  const [added, setAdded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;
    setAddingToCart(true);
    try {
      addItem(productToCartItem(product as any));
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) return (
    <>
      <MarqueeBanner />
      <Navbar />
      <ProductSkeleton />
    </>
  );

  if (error || !product) return (
    <>
      <MarqueeBanner />
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-5 text-center bg-[#F8F8F8]">
        <div className="w-20 h-20 rounded-2xl bg-[#E6E6FA]/60 flex items-center justify-center">
          <svg className="w-10 h-10 text-jet/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          </svg>
        </div>
        <div>
          <p className="font-display text-2xl font-light text-jet mb-2">Produit introuvable</p>
          <p className="text-sm text-jet/50 mb-6">Ce produit n'existe pas ou a été supprimé.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-jet text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#FFCA68] hover:text-jet transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" />
            </svg>
            Retour à la boutique
          </Link>
        </div>
      </div>
    </>
  );

  const isOutOfStock = product.stock_status === "outofstock";
  const gallery = product.images ?? (product.image ? [{ id: 0, src: product.image, alt: product.name }] : []);

  return (
    <>
      <MarqueeBanner />
      <Navbar />

      <main className="min-h-screen bg-[#F8F8F8]">
        <div className="border-b border-[#E6E6FA]/60 bg-white">
          <div className="max-w-7xl mx-auto px-5 lg:px-10 py-3.5">
            <nav className="flex items-center gap-2 text-xs text-jet/40" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-jet transition-colors">Accueil</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-jet transition-colors">Boutique</Link>
              {product.categories.length > 0 && (
                <>
                  <span>/</span>
                  <Link
                    href={`/products?category=${product.categories[0].id}`}
                    className="hover:text-jet transition-colors"
                  >
                    {product.categories[0].name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-jet font-medium truncate max-w-[180px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24">

            {/* ── LEFT: Gallery ── */}
            <ImageGallery images={gallery} />

            {/* ── RIGHT: Product info ── */}
            <div className="flex flex-col gap-6">
              {/* Category + badges */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {product.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.id}`}
                    className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#FFCA68] hover:text-jet transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                {product.on_sale && (
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[#FFCA68] text-jet px-2.5 py-1 rounded-full">
                    Promotion
                  </span>
                )}
              </div>

              {/* Product name */}
              <h1 className="font-display text-3xl lg:text-4xl xl:text-5xl font-light text-jet leading-tight">
                {product.name}
              </h1>

              {/* SKU */}
              {product.sku && (
                <p className="text-xs text-jet/30 font-medium tracking-widest uppercase">
                  Réf. {product.sku}
                </p>
              )}

              {/* Price */}
              <PriceDisplay
                price={product.price}
                regular_price={product.regular_price}
                on_sale={product.on_sale}
              />

              <div className="h-px bg-[#E6E6FA]" />

              {/* Short description */}
              {product.short_description && (
                <div
                  className="text-sm leading-relaxed text-jet/60 prose prose-sm max-w-none
                    prose-p:text-jet/60 prose-strong:text-jet prose-ul:text-jet/60"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              <StockBadge status={product.stock_status} />

              <div className="h-px bg-[#E6E6FA]" />

              {/* Add to cart / Wishlist */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-8 rounded-xl text-sm font-bold tracking-[0.12em] uppercase transition-all duration-300 ${
                    isOutOfStock
                      ? "bg-jet/8 text-jet/30 cursor-not-allowed"
                      : added
                      ? "bg-emerald-600 text-white scale-[0.99]"
                      : addingToCart
                      ? "bg-jet/70 text-white cursor-wait"
                      : "bg-jet text-white hover:bg-[#FFCA68] hover:text-jet active:scale-[0.98]"
                  }`}
                >
                  {added ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      Ajouté au panier
                    </>
                  ) : isOutOfStock ? (
                    "Épuisé"
                  ) : addingToCart ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Ajout…
                    </span>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                      Ajouter au panier
                    </>
                  )}
                </button>

                <WishlistButton productId={product.id} />
              </div>

              <TrustBadges />
            </div>
          </div>
        </div>

        {/* ── Back link ── */}
        <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-16">
          <div className="h-px bg-[#E6E6FA] mb-10" />
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-jet/40 hover:text-jet transition-colors group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12,19 5,12 12,5" />
            </svg>
            Retour à la boutique
          </Link>
        </div>
      </main>
    </>
  );
}