"use client";

import { motion } from "framer-motion";
import { Lock, CreditCard, Banknote, Store } from "lucide-react";

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
  payment_method: "cod" | "clictopay" | "pay_sur_place"; 
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
      desc: "Payez en espèces à la réception de votre colis",
      icon: <Banknote size={20} strokeWidth={1.5} />,
    },
    {
      id: "clictopay" as const,
      label: "Carte Bancaire",
      desc: "Paiement sécurisé via ClicToPay (SMT)",
      icon: <CreditCard size={20} strokeWidth={1.5} />,
    },
    {
      id: "pay_sur_place" as const,
      label: "Paiement au magasin (2h)",
      desc: "Réservez et payez à notre boutique de Sousse",
      icon: <Store size={20} strokeWidth={1.5} />,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
      {/* Shipping summary */}
      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-5 sm:p-6 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase">Récapitulatif de livraison</p>
          <button onClick={onBack} className="text-[11px] text-[#FFCA68] font-bold cursor-pointer hover:text-jet transition-colors underline underline-offset-4">Modifier</button>
        </div>
        <p className="text-[13px] text-jet font-semibold">{form.first_name} {form.last_name}</p>
        <p className="text-[12px] text-neutral-500 mt-1 leading-relaxed">
          {form.address_1}{form.address_2 ? `, ${form.address_2}` : ""}, {form.city}, {form.state}
        </p>
        <p className="text-[12px] text-neutral-400 mt-0.5">{form.phone} · {form.email}</p>
      </div>

      {/* Payment methods */}
      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-5 sm:p-6 mb-4 shadow-sm">
        <p className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase mb-5">Choisir un mode de paiement</p>
        <div className="flex flex-col gap-3">
          {methods.map((m) => {
            const active = form.payment_method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setForm({ ...form, payment_method: m.id })}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 ${
                  active ? "border-jet bg-jet/[0.01] ring-1 ring-jet" : "border-[#EEEEF5] hover:border-neutral-300"
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  active ? "bg-[#FFCA68] text-jet" : "bg-[#F7F7FA] text-neutral-400"
                }`}>
                  {m.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-[13px] font-bold ${active ? "text-jet" : "text-neutral-600"}`}>{m.label}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{m.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  active ? "border-jet bg-jet" : "border-[#EEEEF5]"
                }`}>
                  {active && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security note - Adjusted for Tunisia/SMT context */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[#F0FBF4] rounded-2xl border border-[#C6F0D6] mb-6">
        <div className="w-8 h-8 rounded-full bg-[#1A6B3C]/10 flex items-center justify-center shrink-0">
            <Lock size={14} className="text-[#1A6B3C]" />
        </div>
        <p className="text-[11px] text-[#1A6B3C] leading-tight font-medium">
            Transactions cryptées et sécurisées par protocole SSL. Les paiements par carte sont traités par la plateforme nationale SMT.
        </p>
      </div>

      <button
        onClick={onPlace}
        disabled={isPlacing}
        className="w-full py-4 rounded-2xl bg-jet text-white text-[13px] font-bold tracking-widest cursor-pointer transition-all hover:shadow-lg hover:shadow-jet/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isPlacing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Vérification en cours…
          </>
        ) : (
          <>
            <Lock size={14} className="opacity-80" />
            CONFIRMER LA COMMANDE
          </>
        )}
      </button>
    </motion.div>
  );
}