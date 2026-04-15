"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Lora } from "next/font/google";

// ✅ ZUSTAND CART — replaces CartContext
import { useCart, useCartHydrated } from "@/store/cart-store";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ShippingStep } from "@/components/checkout/ShippingStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { ConfirmationStep } from "@/components/checkout/ConfirmationStep";

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  display: "swap",
});

interface CheckoutForm {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  payment_method: "cod" | "clictopay" | "pay_sur_place";
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  // ── Zustand selectors ──────────────────────────────────────────────────────
  const isHydrated = useCartHydrated();

  const items        = useCart((s) => s.items);
  const promoCode    = useCart((s) => s.promoCode);
  const clear        = useCart((s) => s.clear);

  // Derived values — computed inside the selector so the functions are called
  // once per render and the result is used directly (not stored as functions).
  const subtotal = useCart((s) => s.subtotal());
  const discount = useCart((s) => s.discount());
  const shipping = useCart((s) => s.shipping());
  const total    = useCart((s) => s.total());
  // ──────────────────────────────────────────────────────────────────────────

  const [step, setStep]       = useState(1);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [form, setForm] = useState<CheckoutForm>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    payment_method: "cod",
    notes: "",
  });

  const placeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/checkout/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coupon: promoCode || "",
          // Only send id + quantity + variationId — never trust client-side prices
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            ...(item.variationId ? { variationId: item.variationId } : {}),
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur lors de la commande");
      }
      return res.json();
    },

    onSuccess: (data) => {
      if (data.redirect_url) {
        // ClicToPay redirect flow
        window.location.href = data.redirect_url;
        return;
      }
      setOrderId(data.order_id);
      setStep(3);
    },
  });

  // Redirect to cart if the store is hydrated but the cart is empty (step 1 only)
  useEffect(() => {
    if (isHydrated && items.length === 0 && step === 1) {
      router.push("/cart");
    }
  }, [isHydrated, items.length, router, step]);

  // Show a spinner while the persisted cart is still being rehydrated
  if (!isHydrated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-jet border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F8F8F8]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-10">

          <nav className="flex items-center gap-1.5 text-[11px] text-neutral-300 tracking-widest uppercase mb-6">
            <Link href="/" className="hover:text-jet transition-colors">Accueil</Link>
            <ChevronRight size={10} />
            <Link href="/cart" className="hover:text-jet transition-colors">Panier</Link>
            <ChevronRight size={10} />
            <span className="text-jet">Commande</span>
          </nav>

          <h1 className={`${lora.className} mb-6 sm:mb-8`}>
            <span className="text-[28px] sm:text-[36px] font-normal text-jet tracking-tight">
              Finaliser
            </span>{" "}
            <em className="text-[28px] sm:text-[36px] font-normal text-[#FFCA68] italic">
              la commande
            </em>
          </h1>

          {step < 3 && <StepIndicator step={step} />}

          <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 items-start">
            <div className="flex-1 min-w-0 w-full">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <ShippingStep
                    key="shipping"
                    form={form}
                    setForm={(updatedForm: any) => setForm(updatedForm)}
                    onNext={() => setStep(2)}
                  />
                )}
                {step === 2 && (
                  <PaymentStep
                    key="payment"
                    form={form}
                    setForm={(updatedForm: any) => setForm(updatedForm)}
                    onBack={() => setStep(1)}
                    onPlace={() => placeMutation.mutate()}
                    isPlacing={placeMutation.isPending}
                  />
                )}
                {step === 3 && orderId && (
                  <ConfirmationStep
                    key="confirmation"
                    orderId={orderId}
                    paymentMethod={form.payment_method}
                    onContinue={() => {
                      clear();
                      router.push("/products")}}
                  />
                )}
              </AnimatePresence>

              {placeMutation.isError && (
                <div className="mt-3 px-4 py-3 bg-[#FFF5F5] border border-[#FFD0D0] rounded-xl text-[12px] text-[#9B2626] font-medium">
                  {(placeMutation.error as Error).message}
                </div>
              )}

              {step < 3 && (
                <Link
                  href="/cart"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-jet transition-colors"
                >
                  <ChevronRight size={12} className="rotate-180" />
                  Retour au panier
                </Link>
              )}
            </div>

            {step < 3 && (
              <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-[80px]">
                <OrderSummary
                  items={items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    quantity: item.quantity,
                    price: item.price,
                  }))}
                  subtotal={subtotal}
                  discount={discount}
                  shipping={shipping}
                  total={total}
                  promoCode={promoCode}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}