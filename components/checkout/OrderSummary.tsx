"use client";

import { useState } from "react";
import { ChevronDown, Truck, ShieldCheck, RotateCcw } from "lucide-react";

export function OrderSummary({ items, subtotal, discount, shipping, total, promoCode }: {
  items: Array<{ id: number; name: string; image?: string | null; quantity: number; price: number }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-[#EEEEF5] rounded-2xl overflow-hidden">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 lg:hidden cursor-pointer"
      >
        <span className="text-[12px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
          Récapitulatif
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-jet">{total.toFixed(2)} DT</span>
          <ChevronDown size={14} className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Always visible on lg, toggle on mobile */}
      <div className={`${open ? "block" : "hidden"} lg:block border-t border-[#EEEEF5] lg:border-t-0`}>
        <div className="p-4 sm:p-5">
          <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-4 hidden lg:block">Récapitulatif</p>

          {/* Items */}
          <div className="flex flex-col gap-3 mb-5">
            {items.map((item) => (
              <div key={`${item.id}`} className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F7FA] border border-[#EEEEF5] overflow-hidden">
                    <img src={item.image || "/placeholder-product.jpg"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-jet text-white text-[9px] font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-jet line-clamp-1">{item.name}</p>
                </div>
                <span className="text-[13px] font-bold text-jet shrink-0">{(item.price * item.quantity).toFixed(2)} DT</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-2 border-t border-[#EEEEF5] pt-4">
            <div className="flex justify-between text-[13px]">
              <span className="text-neutral-400">Sous-total</span>
              <span className="font-medium text-jet">{subtotal.toFixed(2)} DT</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[13px]">
                <span className="text-[#1A6B3C]">Réduction</span>
                <span className="font-medium text-[#1A6B3C]">−{discount.toFixed(2)} DT</span>
              </div>
            )}
            <div className="flex justify-between text-[13px]">
              <span className="text-neutral-400">Livraison</span>
              {shipping === 0
                ? <span className="font-medium text-[#1A6B3C]">Gratuite</span>
                : <span className="font-medium text-jet">{shipping.toFixed(2)} DT</span>
              }
            </div>
            {shipping > 0 && (
              <p className="text-[11px] text-neutral-300">Livraison gratuite dès 300 DT</p>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-[#EEEEF5] mt-1">
              <span className="text-[13px] font-bold text-jet uppercase tracking-wider">Total</span>
              <span className="text-[20px] font-bold text-jet">{total.toFixed(2)} <span className="text-[13px] font-medium text-neutral-400">DT</span></span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#EEEEF5]">
            {[
              { icon: <Truck size={13} />, label: "Livraison rapide" },
              { icon: <ShieldCheck size={13} />, label: "Paiement sécurisé" },
              { icon: <RotateCcw size={13} />, label: "Retours gratuits" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-7 h-7 rounded-full bg-[#F7F7FA] flex items-center justify-center text-neutral-400">
                  {icon}
                </div>
                <span className="text-[10px] text-neutral-400 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}