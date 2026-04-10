"use client";

import { motion } from "framer-motion";
import { ChevronRight, Lock } from "lucide-react";

interface CheckoutFormType {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  payment_method: "cod" | "card" | "konnect";
  notes: string;
}

export function PaymentStep({ form, setForm, onBack, onPlace, isPlacing }: {
  form: CheckoutFormType;
  setForm: (f: CheckoutFormType) => void;
  onBack: () => void;
  onPlace: () => void;
  isPlacing: boolean;
}) {
  const methods = [
    {
      id: "cod" as const,
      label: "Paiement à la livraison",
      desc: "Payez en espèces à la réception",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="6" width="20" height="12" rx="2" /><path d="M22 10H2M6 14h2" />
        </svg>
      ),
    },
    {
      id: "konnect" as const,
      label: "Konnect",
      desc: "Paiement en ligne sécurisé",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
      {/* Shipping summary */}
      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-5 sm:p-6 mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">Livraison</p>
          <button onClick={onBack} className="text-[11px] text-[#FFCA68] font-semibold cursor-pointer hover:text-jet transition-colors">Modifier</button>
        </div>
        <p className="text-[13px] text-jet font-medium">{form.first_name} {form.last_name}</p>
        <p className="text-[12px] text-neutral-400">{form.address_1}{form.address_2 ? `, ${form.address_2}` : ""}, {form.city}, {form.state}</p>
        <p className="text-[12px] text-neutral-400">{form.phone} · {form.email}</p>
      </div>

      {/* Payment methods */}
      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-5 sm:p-6 mb-4">
        <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-4">Mode de paiement</p>
        <div className="flex flex-col gap-2.5">
          {methods.map((m) => {
            const active = form.payment_method === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setForm({ ...form, payment_method: m.id })}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  active ? "border-jet bg-jet/[0.02]" : "border-[#E6E6FA] hover:border-neutral-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  active ? "bg-[#FFCA68]/20 text-jet" : "bg-[#F7F7FA] text-neutral-300"
                }`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-[13px] font-semibold ${active ? "text-jet" : "text-neutral-500"}`}>{m.label}</p>
                  <p className="text-[11px] text-neutral-400">{m.desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  active ? "border-jet bg-jet" : "border-[#E6E6FA]"
                }`}>
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#F0FBF4] rounded-xl border border-[#C6F0D6] mb-4">
        <Lock size={12} className="text-[#1A6B3C] shrink-0" />
        <p className="text-[11px] text-[#1A6B3C]">Transaction sécurisée SSL 256-bit. Vos données sont protégées.</p>
      </div>

      <button
        onClick={onPlace}
        disabled={isPlacing}
        className="w-full py-3.5 rounded-2xl bg-jet text-white text-[13px] font-bold tracking-wider cursor-pointer transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden"
      >
        {isPlacing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Traitement en cours…
          </>
        ) : (
          <>
            <Lock size={13} />
            Confirmer la commande
          </>
        )}
      </button>
    </motion.div>
  );
}
