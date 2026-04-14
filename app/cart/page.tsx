"use client";

import Image from "next/image";
import { useState,useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartContext } from "@/components/cart/CartContext";
import { motion, useScroll } from "framer-motion";
import { PromoCodeSchema } from "@/lib/validation-schemas";
export default function CartPage() {
  const { cart, updateQty, removeItem, applyPromo, removePromo } = useCartContext();
  const { items, subtotal, discount, shipping, total, promoCode } = cart;

const [promoInput, setPromoInput] = useState("");
const [promoMessage, setPromoMessage] = useState<{ text: string; ok: boolean } | null>(null);
const [promoLoading, setPromoLoading] = useState(false);
const [promoError, setPromoError] = useState<string | null>(null); 
const handlePromoChange = (val: string) => {
  setPromoInput(val);
  if (promoError) {
    const result = PromoCodeSchema.safeParse({ code: val.trim() });
    if (result.success) setPromoError(null);
  }
};

const handleApplyPromo = async () => {
  if (!promoInput.trim()) return;
  const parsed = PromoCodeSchema.safeParse({ code: promoInput.trim() });
  if (!parsed.success) {
    setPromoError(parsed.error.flatten().fieldErrors.code?.[0] ?? "Invalid code");
    return;
  }

  setPromoError(null);
  setPromoLoading(true);
  setPromoMessage(null);
  const result = await applyPromo(promoInput.trim());
  setPromoMessage({ text: result.message, ok: result.success });
  setPromoLoading(false);
};

const handleRemovePromo = () => {
  removePromo();
  setPromoInput("");
  setPromoMessage(null);
  setPromoError(null); 
};
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollYProgress } = useScroll();


useEffect(() => {
  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <>
      <Navbar />

      <main className="w-full min-h-screen bg-snow">

        {/* PAGE HEADER */}
        <div className="border-b border-[#1a1a2e]/8 px-8 md:px-16 py-10">
          <p className="uppercase text-[#1a1a2e]/40 text-[10px] font-semibold tracking-[0.26em] mb-3">
            Your Selection
          </p>
          <h1
            className="font-display font-light text-[#1a1a2e] leading-[1.06]"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)" }}
          >
            Shopping <em className="italic">Cart</em>
          </h1>
        </div>

        {items.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <p
              className="font-display font-light text-[#1a1a2e]/30 mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}
            >
              ∅
            </p>
            <p className="font-display font-light text-[#1a1a2e] text-2xl mb-4">
              Your cart is <em className="italic">empty</em>
            </p>
            <p className="text-[#1a1a2e]/50 text-[14px] font-light leading-relaxed max-w-[36ch] mb-10">
              You haven't added anything yet. Explore our collections and find
              something that speaks to you.
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center bg-jet text-snow border border-jet text-[11px] font-semibold tracking-[0.18em] uppercase px-10 py-4 rounded-[3px] transition-all duration-200 hover:bg-[#FFCA68] hover:text-jet hover:border-[#FFCA68]"
            >
              Explore Collection
            </a>
          </div>
        ) : (
          /* CART LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] items-start">

            {/* LEFT — LINE ITEMS */}
            <div className="px-8 md:px-16 py-12">
              <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-6 pb-4 border-b border-[#1a1a2e]/10 mb-2">
                {["Product", "Price", "Quantity", "Total"].map((h) => (
                  <p key={h} className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#1a1a2e]/35">
                    {h}
                  </p>
                ))}
              </div>

              {items.map((item) => (
                <div
                  key={`${item.id}-${item.variationId ?? "base"}`}
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-6 items-center py-8 border-b border-[#1a1a2e]/8"
                >
                  <div className="flex gap-5 items-center">
                    <div className="relative w-22 h-22 rounded-sm overflow-hidden bg-[#E6E6FA]/40 shrink-0">
                      <Image src={item.image || "/placeholder-product.jpg"} alt={item.name} fill className="object-cover object-center" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1a1a2e]/35 mb-1">
                        {item.category}
                      </p>
                      <p className="font-display font-light text-[#1a1a2e] text-[1.15rem] leading-tight mb-1">
                        {item.name}
                      </p>
                      {item.variant && (
                        <p className="text-[12px] text-[#1a1a2e]/40 font-light">{item.variant}</p>
                      )}
                      <button
                        onClick={() => removeItem(item.id, item.variationId)}
                        className="mt-2 text-[11px] font-light text-[#1a1a2e]/30 hover:text-[#1a1a2e] transition-colors duration-150 tracking-wide underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="text-[#1a1a2e] text-[14px] font-light md:text-right">
                    {item.price.toFixed(2)} <span className="text-[#1a1a2e]/40 text-[11px]">TND</span>
                  </p>

                  <div className="flex items-center border border-[#1a1a2e]/15 rounded-[3px] overflow-hidden w-fit">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1, item.variationId)}
                      className="w-9 h-9 flex items-center justify-center text-[#1a1a2e]/50 hover:bg-[#1a1a2e]/5 transition-colors duration-150 text-lg font-light leading-none"
                    >−</button>
                    <span className="w-9 h-9 flex items-center justify-center text-[13px] font-light text-[#1a1a2e] border-x border-[#1a1a2e]/15">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1, item.variationId)}
                      className="w-9 h-9 flex items-center justify-center text-[#1a1a2e]/50 hover:bg-[#1a1a2e]/5 transition-colors duration-150 text-lg font-light leading-none"
                    >+</button>
                  </div>

                  <p className="text-[#1a1a2e] text-[14px] font-medium md:text-right">
                    {(item.price * item.quantity).toFixed(2)}{" "}
                    <span className="text-[#1a1a2e]/40 text-[11px] font-light">TND</span>
                  </p>
                </div>
              ))}

              <div className="mt-8">
                <a
                  href="/products"
                  className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#1a1a2e]/40 hover:text-[#1a1a2e] transition-colors duration-200"
                >
                  <span className="text-base leading-none">←</span>
                  Continue Shopping
                </a>
              </div>
            </div>

            {/* RIGHT — ORDER SUMMARY */}
            <div className="lg:border-l border-[#1a1a2e]/8 bg-[#F0ECE6] px-8 py-12 lg:min-h-[calc(100vh-130px)] flex flex-col gap-8">
              <div>
                <p className="uppercase text-[#1a1a2e]/40 text-[10px] font-semibold tracking-[0.26em] mb-6">
                  Order Summary
                </p>
                <div className="space-y-4 text-[14px] font-light">
                  <div className="flex justify-between text-[#1a1a2e]/70">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} TND</span>
                  </div>
                  {promoCode && discount > 0 && (
                    <div className="flex justify-between text-[#1a1a2e]/70">
                      <span>Discount</span>
                      <span className="text-[#FFCA68]">− {discount.toFixed(2)} TND</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#1a1a2e]/70">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0
                        ? <span className="text-[#1a1a2e]/40 text-[12px] tracking-wide">Free</span>
                        : `${shipping.toFixed(2)} TND`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-[#1a1a2e]/35 leading-relaxed">
                      Free shipping on orders over 300 TND
                    </p>
                  )}
                  <div className="border-t border-[#1a1a2e]/10 pt-4 flex justify-between items-baseline">
                    <span className="font-displaytext-[1.3rem] font-light text-[#1a1a2e]">Total</span>
                    <span className="font-display text-[1.5rem] font-light text-[#1a1a2e]">
                      {total.toFixed(2)}{" "}
                      <span className="text-[14px] text-[#1a1a2e]/40 font-light">TND</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo code */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#1a1a2e]/40 mb-3">
                Promo Code
              </p>
              {promoCode ? (
                <div className="flex items-center justify-between border border-[#FFCA68]/50 bg-[#FFCA68]/10 rounded-[3px] px-4 py-2.5">
                  <span className="text-[13px] font-light text-[#1a1a2e]/70 tracking-wider">{promoCode}</span>
                  <button
                    onClick={handleRemovePromo}
                    className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1a1a2e]/40 hover:text-[#1a1a2e] transition-colors duration-150"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => handlePromoChange(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      placeholder="Enter code"
                      maxLength={20}
                      className={`flex-1 bg-transparent border rounded-[3px] px-4 py-2.5 text-[13px] font-light text-[#1a1a2e] placeholder:text-[#1a1a2e]/25 focus:outline-none transition-colors duration-150 ${
                        promoError
                          ? "border-red-400 focus:border-red-400"
                          : "border-[#1a1a2e]/15 focus:border-[#1a1a2e]/40"
                      }`}
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                      className="px-5 py-2.5 border border-[#1a1a2e]/20 rounded-[3px] text-[11px] font-semibold tracking-[0.16em] uppercase text-[#1a1a2e]/60 hover:border-[#1a1a2e]/50 hover:text-[#1a1a2e] transition-all duration-150 whitespace-nowrap disabled:opacity-40"
                    >
                      {promoLoading ? "..." : "Apply"}
                    </button>
                  </div>

                  {/* Format error (client-side Zod) */}
                  {promoError && (
                    <p className="mt-2 text-[11px] tracking-wide text-red-400">{promoError}</p>
                  )}

                  {/* Server response (valid/invalid code from API) */}
                  {!promoError && promoMessage && (
                    <p className={`mt-2 text-[11px] tracking-wide ${promoMessage.ok ? "text-[#1a1a2e]/50" : "text-red-400"}`}>
                      {promoMessage.text}
                    </p>
                  )}
                </>
              )}
            </div>

              {/* Checkout CTA */}
              <div className="flex flex-col gap-3 mt-auto">
                <a
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center bg-jet text-snow border border-jet text-[11px] font-semibold tracking-[0.2em] uppercase px-8 py-4 rounded-[3px] transition-all duration-200 hover:bg-[#FFCA68] hover:text-jet hover:border-[#FFCA68]"
                >
                  Proceed to Checkout
                </a>
                <p className="text-center text-[11px] text-[#1a1a2e]/30 font-light tracking-wide">
                  Secure checkout · Free returns
                </p>
              </div>

              {/* Trust strip */}
              <div className="border-t border-[#1a1a2e]/8 pt-6 grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: "⟳", label: "Free returns" },
                  { icon: "◈", label: "Secure payment" },
                  { icon: "◎", label: "Artisan sourced" },
                ].map((t) => (
                  <div key={t.label}>
                    <p className="text-[18px] text-[#1a1a2e]/25 mb-1">{t.icon}</p>
                    <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#1a1a2e]/30">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="
              fixed bottom-6 right-6 z-50
              w-12 h-12 rounded-full
              flex items-center justify-center
              bg-jet text-snow
              shadow-lg
              transition-all duration-300
              hover:scale-110 hover:bg-[#FFCA68] hover:text-jet
              active:scale-95
            "
          >
            {/* Circular progress ring */}
            <svg className="absolute w-12 h-12 -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-white/10"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-[#FFCA68]"
                strokeLinecap="round"
                style={{
                  pathLength: scrollYProgress,
                }}
              />
            </svg>

            {/* Center arrow */}
            <span className="relative text-lg leading-none flex items-center justify-center w-full h-full">
              ↑
            </span>
          </button>
        )}
      </main>

      <Footer />
    </>
  );
}