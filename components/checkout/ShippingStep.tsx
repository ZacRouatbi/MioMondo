"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { CheckoutFormSchema } from "@/lib/validation-schemas"; // adjust path as needed

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

type FieldErrors = Partial<Record<keyof CheckoutFormType, string>>;

const TN_STATES = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine",
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
  "Tataouine", "Tozeur", "Tunis", "Zaghouan",
];

// Validate a single field by running the full schema and picking the relevant error
function validateField(field: keyof CheckoutFormType, form: CheckoutFormType): string | null {
  const result = CheckoutFormSchema.safeParse({
    ...form,
    payment_method: form.payment_method || "cod", // satisfy schema for partial checks
  });
  if (result.success) return null;
  const fieldError = result.error.flatten().fieldErrors[field];
  return fieldError?.[0] ?? null;
}

export function ShippingStep({ form, setForm, onNext }: {
  form: CheckoutFormType;
  setForm: (f: CheckoutFormType) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormType, boolean>>>({});

  const inputClass = (field: keyof CheckoutFormType) =>
    `w-full p-[10px_14px] rounded-xl border bg-[#FAFAFA] text-[13px] text-jet outline-none transition-all focus:ring-4 placeholder:text-neutral-300 ${
      errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
        : "border-[#E6E6FA] focus:border-[#FFCA68] focus:ring-[#FFCA68]/15"
    }`;

  const labelClass = "text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5 block";

  const handleBlur = (field: keyof CheckoutFormType) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const error = validateField(field, form);
    setErrors((e) => ({ ...e, [field]: error ?? undefined }));
  };

  const handleChange = (field: keyof CheckoutFormType, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    // Clear error as user types if field was already touched
    if (touched[field]) {
      const error = validateField(field, updated);
      setErrors((e) => ({ ...e, [field]: error ?? undefined }));
    }
  };

  const handleNext = () => {
    // Full validation pass on click
    const result = CheckoutFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: FieldErrors = {};
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        mapped[key as keyof CheckoutFormType] = msgs?.[0];
      }
      setErrors(mapped);
      // Mark all fields as touched so errors show
      const allTouched = Object.fromEntries(
        Object.keys(form).map((k) => [k, true])
      ) as Partial<Record<keyof CheckoutFormType, boolean>>;
      setTouched(allTouched);
      return;
    }
    onNext();
  };

  const ErrorMsg = ({ field }: { field: keyof CheckoutFormType }) =>
    errors[field] ? (
      <p className="text-[11px] text-red-500 mt-1">{errors[field]}</p>
    ) : null;

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }}>
      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-5 sm:p-6 mb-4">
        <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-5">Informations de contact</p>
        <div className="flex flex-col gap-3.5">

          <div>
            <label className={labelClass}>Adresse e-mail *</label>
            <input
              type="email"
              className={inputClass("email")}
              placeholder="vous@exemple.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />
            <ErrorMsg field="email" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>Prénom *</label>
              <input
                className={inputClass("first_name")}
                placeholder="Prénom"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                onBlur={() => handleBlur("first_name")}
              />
              <ErrorMsg field="first_name" />
            </div>
            <div>
              <label className={labelClass}>Nom *</label>
              <input
                className={inputClass("last_name")}
                placeholder="Nom"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                onBlur={() => handleBlur("last_name")}
              />
              <ErrorMsg field="last_name" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Téléphone *</label>
            <input
              type="tel"
              className={inputClass("phone")}
              placeholder="+216 XX XXX XXX"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
            />
            <ErrorMsg field="phone" />
          </div>

        </div>
      </div>

      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-5 sm:p-6 mb-4">
        <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-5">Adresse de livraison</p>
        <div className="flex flex-col gap-3.5">

          <div>
            <label className={labelClass}>Adresse *</label>
            <input
              className={inputClass("address_1")}
              placeholder="Rue, numéro…"
              value={form.address_1}
              onChange={(e) => handleChange("address_1", e.target.value)}
              onBlur={() => handleBlur("address_1")}
            />
            <ErrorMsg field="address_1" />
          </div>

          <div>
            <label className={labelClass}>Complément d'adresse</label>
            <input
              className={inputClass("address_2")}
              placeholder="Appartement, étage…"
              value={form.address_2}
              onChange={(e) => handleChange("address_2", e.target.value)}
              onBlur={() => handleBlur("address_2")}
            />
            <ErrorMsg field="address_2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={labelClass}>Gouvernorat *</label>
              <div className="relative">
                <select
                  className={`${inputClass("state")} appearance-none pr-8 cursor-pointer`}
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  onBlur={() => handleBlur("state")}
                >
                  <option value="">Sélectionner…</option>
                  {TN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 pointer-events-none rotate-90" />
              </div>
              <ErrorMsg field="state" />
            </div>
            <div>
              <label className={labelClass}>Ville *</label>
              <input
                className={inputClass("city")}
                placeholder="Ville"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                onBlur={() => handleBlur("city")}
              />
              <ErrorMsg field="city" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Code postal</label>
            <input
              className={inputClass("postcode")}
              placeholder="1000"
              value={form.postcode}
              onChange={(e) => handleChange("postcode", e.target.value)}
              onBlur={() => handleBlur("postcode")}
            />
            <ErrorMsg field="postcode" />
          </div>

          <div>
            <label className={labelClass}>Note de commande</label>
            <textarea
              className={`${inputClass("notes")} resize-none h-20`}
              placeholder="Instructions spéciales, informations de livraison…"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              onBlur={() => handleBlur("notes")}
            />
            <ErrorMsg field="notes" />
          </div>

        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full py-3.5 rounded-2xl bg-jet text-white text-[13px] font-bold tracking-wider cursor-pointer transition-all hover:opacity-90 flex items-center justify-center gap-2"
      >
        Continuer vers le paiement
        <ChevronRight size={15} />
      </button>
    </motion.div>
  );
}