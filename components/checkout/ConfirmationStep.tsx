"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function ConfirmationStep({ orderId, onContinue }: { orderId: number; onContinue: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <div className="bg-white border border-[#EEEEF5] rounded-2xl p-8 sm:p-10 text-center">
        {/* Animated checkmark */}
        <div className="w-16 h-16 rounded-full bg-[#F0FBF4] border border-[#C6F0D6] flex items-center justify-center mx-auto mb-5">
          <motion.svg
            width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>

        <h2 className="font-serif text-[22px] sm:text-[26px] font-normal text-jet mb-2 tracking-wide">
          Commande confirmée !
        </h2>
        <p className="text-[13px] text-neutral-400 mb-1">
          Merci pour votre confiance. Votre commande <span className="font-bold text-jet">#{orderId}</span> a bien été reçue.
        </p>
        <p className="text-[12px] text-neutral-300 mb-8">
          Un e-mail de confirmation vous sera envoyé sous peu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {[
            { label: "Traitement", value: "1–2 jours ouvrés", icon: "📋" },
            { label: "Livraison", value: "3–5 jours ouvrés", icon: "🚚" },
            { label: "Support", value: "support@miomondo.tn", icon: "💬" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-4 bg-[#F7F7FA] rounded-xl">
              <span className="text-lg">{icon}</span>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">{label}</p>
              <p className="text-[12px] font-medium text-jet text-center">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account?view=orders"
            className="px-6 py-2.5 rounded-xl bg-jet text-white text-[13px] font-bold hover:opacity-90 transition-opacity text-center"
          >
            Voir mes commandes
          </Link>
          <button
            onClick={onContinue}
            className="px-6 py-2.5 rounded-xl border border-[#E6E6FA] text-jet text-[13px] font-bold hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    </motion.div>
  );
}
