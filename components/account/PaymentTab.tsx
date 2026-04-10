"use client";
import { useState, useEffect } from "react";
import Section from "./Section";

export default function PaymentTab() {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/payment-methods")
      .then((r) => r.json())
      .then((data) => { setMethods(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const removeMethod = async (tokenId: string) => {
    await fetch("/api/account/payment-methods", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_id: tokenId }),
    });
    setMethods((prev) => prev.filter((m) => m.token_id !== tokenId));
  };

  const CARD_ICONS: Record<string, string> = { visa: "VISA", mastercard: "MC", amex: "AMEX" };

  if (loading) return <div className="p-10 text-center text-neutral-400 text-[14px]">Chargement…</div>;

  return (
    <div className="flex flex-col gap-4">
      <Section title="Cartes enregistrées">
        {/* Security notice */}
        <div className="flex items-start gap-2.5 p-3 sm:p-[12px_16px] bg-[#F0FBF4] rounded-xl border border-[#C6F0D6] mb-4">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="1.8" className="shrink-0 mt-0.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <p className="text-[12px] text-[#1A6B3C] m-0 leading-relaxed">
            Vos informations de paiement sont chiffrées et sécurisées. Nous ne stockons jamais vos numéros de carte complets.
          </p>
        </div>

        {!methods.length ? (
          <p className="text-[14px] text-neutral-400 text-center py-6">Aucun moyen de paiement enregistré</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {methods.map((method) => (
              <div key={method.token_id} className="flex items-center justify-between gap-3 p-3 sm:p-[14px_18px] rounded-xl bg-white border border-[#EEEEF5] flex-wrap">
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div className="w-10 h-7 sm:w-11 sm:h-7 rounded-md bg-jet text-white flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold tracking-wider shrink-0">
                    {CARD_ICONS[method.card_type] ?? "CARD"}
                  </div>
                  <div>
                    <p className="text-[13px] sm:text-[14px] font-medium text-jet m-0">•••• •••• •••• {method.last4}</p>
                    <p className="text-[11px] sm:text-[12px] text-neutral-400 m-0">Expire {method.expiry_month}/{method.expiry_year}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeMethod(method.token_id)}
                  className="px-3 sm:px-3.5 py-1.5 rounded-full border border-[#FFD0D0] bg-[#FFF5F5] text-[#9B2626] text-[11px] sm:text-[12px] font-semibold cursor-pointer hover:bg-[#FFEAEA] transition-colors shrink-0"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => (window.location.href = "/account/payment/add")}
          className="mt-3.5 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-[1.5px] border-dashed border-[#E6E6FA] bg-transparent text-neutral-400 text-[12px] sm:text-[13px] font-medium cursor-pointer w-full hover:border-neutral-300 hover:text-neutral-500 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Ajouter un moyen de paiement
        </button>
      </Section>
    </div>
  );
}