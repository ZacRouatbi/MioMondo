"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Copy, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Lora } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"], display: "swap" });

export default function ResetSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const password = params.get("p");
  const error = params.get("error");

  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (password) {
      window.history.replaceState({}, "", "/reset-success");
    }
  }, [password]);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const errorMessage =
    error === "expired"
      ? "Ce lien a expiré. Les liens de réinitialisation sont valables 1 heure."
      : error === "invalid"
      ? "Lien invalide."
      : error === "update"
      ? "Erreur lors de la mise à jour. Veuillez réessayer."
      : null;

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-snow flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-snow border border-snow rounded-2xl p-10 text-center shadow-sm"
      >
        {errorMessage ? (
          <>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={26} className="text-red-400" />
            </div>
            <h1 className={`${lora.className} text-2xl font-normal text-[#1a1a2e] mb-3`}>
              Lien invalide
            </h1>
            <p className="text-[#1a1a2e]/50 text-[14px] leading-relaxed mb-8">
              {errorMessage}
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-jet text-snow py-3.5 rounded-xl text-[13px] font-semibold tracking-wider hover:bg-jet transition-colors"
            >
              Retour à l'accueil
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-jet/15 flex items-center justify-center mx-auto mb-6">
              <Check size={26} className="text-[#FFCA68]" />
            </div>
            <h1 className={`${lora.className} text-2xl font-normal text-[#1a1a2e] mb-2`}>
              Mot de passe activé
            </h1>
            <p className="text-jet/50 text-[14px] leading-relaxed mb-8">
              Votre nouveau mot de passe est prêt. Copiez-le et connectez-vous.
            </p>
            <div className="flex items-center gap-0 bg-[#1a1a2e] rounded-xl overflow-hidden mb-6">
              <span className="flex-1 font-mono text-white text-[17px] font-bold tracking-widest px-5 py-4 select-all">
                {password}
              </span>
              <button
                onClick={handleCopy}
                className={`px-4 py-4 transition-colors shrink-0 border-l border-white/10 ${
                  copied
                    ? "text-[#FFCA68]"
                    : "text-snow/40 hover:text-snow"
                }`}
                title="Copier le mot de passe"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            {copied && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[12px] text-[#1a1a2e]/40 mb-6 -mt-2"
              >
                Copié dans le presse-papiers ✓
              </motion.p>
            )}

            <button
              onClick={() => router.push("/")}
              className="w-full bg-jet text-snow py-3.5 rounded-xl text-[13px] font-semibold tracking-wider hover:bg-jet transition-colors"
            >
              Se connecter
            </button>

            <p className="mt-5 text-[11px] text-[#1a1a2e]/30 leading-relaxed">
              Pour votre sécurité, modifiez ce mot de passe depuis votre espace client après connexion.
            </p>
          </>
        )}
      </motion.div>
    </div>
    <Footer/>
    </>
  );
}