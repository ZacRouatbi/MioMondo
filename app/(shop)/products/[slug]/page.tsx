// app/products/[slug]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import { useCartContext } from "@/components/cart/CartContext";
import { productToCartItem } from "@/hooks/useProducts";
import Navbar from "@/components/layout/Navbar";
import MarqueeBanner from "@/components/layout/MarqueeBanner";

// ── Sub-components ────────────────────────────────────────────────────────────

function ImageGallery({
  images,
}: {
  images: { id: number; src: string; alt: string }[];
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (images.length === 0) {
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
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden bg-[#F8F8F8] aspect-square cursor-zoom-in group"
        onClick={() => setZoomed(true)}
      >
        <img
          key={images[active]?.src}
          src={images[active]?.src}
          alt={images[active]?.alt || "Product image"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Zoom hint */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-3.5 h-3.5 text-jet/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span className="text-[10px] font-semibold text-jet/60 tracking-wide">Agrandir</span>
        </div>

        {/* Image counter badge */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-jet/60 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip — only shown if gallery has more than 1 image */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                i === active
                  ? "ring-2 ring-[#FFCA68] ring-offset-2"
                  : "ring-1 ring-jet/10 opacity-60 hover:opacity-100 hover:ring-jet/25"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt || `Vue ${i + 1}`}
                className="w-full h-full object-cover"
              />
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
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setZoomed(false)}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={images[active]?.src}
            alt={images[active]?.alt}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function StockBadge({ status }: { status: string }) {
  const config = {
    instock:     { label: "En stock",           dot: "bg-emerald-400", text: "text-emerald-700",  bg: "bg-emerald-50"  },
    outofstock:  { label: "Rupture de stock",   dot: "bg-red-400",     text: "text-red-700",      bg: "bg-red-50"      },
    onbackorder: { label: "Sur commande",       dot: "bg-amber-400",   text: "text-amber-700",    bg: "bg-amber-50"    },
  }[status] ?? { label: status, dot: "bg-jet/30", text: "text-jet/60", bg: "bg-jet/5" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function PriceDisplay({ price, regular_price, on_sale }: {
  price: string;
  regular_price: string;
  on_sale: boolean;
}) {
  const current = parseFloat(price) || 0;
  const regular = parseFloat(regular_price) || 0;
  const discount = on_sale && regular > current
    ? Math.round(((regular - current) / regular) * 100)
    : 0;

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className="font-display text-4xl font-light text-jet tracking-tight">
        {current.toFixed(2)}
        <span className="text-xl ml-1.5 text-jet/40 font-light">TND</span>
      </span>

      {on_sale && regular > current && (
        <>
          <span className="text-xl text-jet/30 line-through font-light">
            {regular.toFixed(2)} TND
          </span>
          <span className="text-sm font-bold bg-[#FFCA68] text-jet px-2.5 py-0.5 rounded-full">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image skeleton */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl bg-[#E6E6FA]/60 animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 rounded-xl bg-[#E6E6FA]/60 animate-pulse" />
              ))}
            </div>
          </div>
          {/* Info skeleton */}
          <div className="space-y-5 pt-2">
            <div className="h-3 w-32 bg-[#E6E6FA]/80 rounded-full animate-pulse" />
            <div className="h-10 w-4/5 bg-[#E6E6FA]/80 rounded-lg animate-pulse" />
            <div className="h-10 w-2/5 bg-[#E6E6FA]/80 rounded-lg animate-pulse" />
            <div className="h-20 bg-[#E6E6FA]/60 rounded-xl animate-pulse" />
            <div className="h-14 bg-[#E6E6FA]/80 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

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
      // productToCartItem expects a Product shape — product has all those fields
      addItem(productToCartItem(product as any));
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  // ── Loading ──
  if (isLoading) return (
    <>
      <MarqueeBanner />
      <Navbar />
      <Skeleton />
    </>
  );

  // ── Error / Not found ──
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

        {/* ── Breadcrumb ── */}
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
            <div className="lg:sticky lg:top-6 lg:self-start">
              <ImageGallery images={gallery} />
            </div>

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

              {/* Divider */}
              <div className="h-px bg-[#E6E6FA]" />

              {/* Short description */}
              {product.short_description && (
                <div
                  className="text-sm leading-relaxed text-jet/60 prose prose-sm max-w-none
                    prose-p:text-jet/60 prose-strong:text-jet prose-ul:text-jet/60"
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
              )}

              {/* Stock status */}
              <StockBadge status={product.stock_status} />

              {/* Divider */}
              <div className="h-px bg-[#E6E6FA]" />

              {/* Add to cart */}
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

                {/* Wishlist / share — cosmetic for now */}
                <button className="w-12 h-12 sm:w-14 sm:h-auto rounded-xl border border-[#E6E6FA] hover:border-[#FFCA68] hover:bg-[#FFCA68]/10 flex items-center justify-center text-jet/40 hover:text-jet transition-all duration-200 flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="1" y="3" width="15" height="13" rx="1" />
                        <path d="M16 8h4l3 5v3h-7V8z" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    ),
                    label: "Livraison rapide",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    label: "Paiement sécurisé",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="23,4 23,10 17,10" />
                        <polyline points="1,20 1,14 7,14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                    ),
                    label: "Retour facile",
                  },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-[#E6E6FA]/60 text-center"
                  >
                    <span className="text-[#FFCA68]">{icon}</span>
                    <span className="text-[10px] font-medium text-jet/50 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
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