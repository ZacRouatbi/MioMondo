"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

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

const TN_STATES = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine",
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
  "Tataouine", "Tozeur", "Tunis", "Zaghouan",
];

export function ShippingStep({ form, setForm, onNext }: {
  form: CheckoutFormType;
  setForm: (f: CheckoutFormType) => void;
  onNext: () => void;
}) {
  const inputClass = "w-full p-[10px_14px] rounded-xl border border-[#E6E6FA] bg-[#FAFAFA] text-[13px] text-jet outline-none transition-all focus:border-[#FFCA68] focus:ring-4 focus:ring-[#FFCA68]/15 placeholder:text-neutral-300";
  const labelClass = "text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5 block";

  const isValid = form.email && form.first_name && form.last_name && form.phone && form.address_1 && form.city && form.state;

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-5 sm:p-6 mb-4">
        <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-5">Informations de contact</p>
        <div className="flex flex-col gap-3.5">
          <div>
            <label className={labelClass}>Adresse e-mail *</label>
            <input type="email" className={inputClass} placeholder="vous@exemple.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>Prénom *</label>
              <input className={inputClass} placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Nom *</label>
              <input className={inputClass} placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Téléphone *</label>
            <input type="tel" className={inputClass} placeholder="+216 XX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-5 sm:p-6 mb-4">
        <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-5">Adresse de livraison</p>
        <div className="flex flex-col gap-3.5">
          <div>
            <label className={labelClass}>Adresse *</label>
            <input className={inputClass} placeholder="Rue, numéro…" value={form.address_1} onChange={(e) => setForm({ ...form, address_1: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Complément d'adresse</label>
            <input className={inputClass} placeholder="Appartement, étage…" value={form.address_2} onChange={(e) => setForm({ ...form, address_2: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>Gouvernorat *</label>
              <div className="relative">
                <select
                  className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                >
                  <option value="">Sélectionner…</option>
                  {TN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none rotate-90" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Ville *</label>
              <input className={inputClass} placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Code postal</label>
            <input className={inputClass} placeholder="1000" value={form.postcode} onChange={(e) => setForm({ ...form, postcode: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Note de commande</label>
            <textarea
              className={`${inputClass} resize-none h-20`}
              placeholder="Instructions spéciales, informations de livraison…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full py-3.5 rounded-2xl bg-jet text-white text-[13px] font-bold tracking-wider cursor-pointer transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Continuer vers le paiement
        <ChevronRight size={15} />
      </button>
    </motion.div>
  );
}
