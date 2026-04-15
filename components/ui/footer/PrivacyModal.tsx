"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Lock, EyeOff } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500"] });

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-jet/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-snow rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-jet/5 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFCA68]/20 flex items-center justify-center">
                  <ShieldCheck size={22} className="text-jet" />
                </div>
                <h2 className={`${lora.className} text-xl text-jet font-medium`}>
                  Politique de Confidentialité
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-jet/5 rounded-full transition-colors">
                <X size={20} className="text-jet/50" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto text-sm text-jet/70 leading-relaxed space-y-6">
              <section>
                <h3 className="text-jet font-semibold mb-2 flex items-center gap-2">
                  <Lock size={16} className="text-[#FFCA68]" /> Collecte des Données
                </h3>
                <p>
                  Conformément à la loi tunisienne sur la protection des données personnelles, nous collectons uniquement les informations nécessaires au traitement de vos commandes : Nom, Prénom, Adresse de livraison en Tunisie, et Numéro de téléphone.
                </p>
              </section>

              <section>
                <h3 className="text-jet font-semibold mb-2">Utilisation des Informations</h3>
                <p>
                  Vos données nous permettent de gérer votre compte Mio Mondo, de traiter vos paiements et d&apos;assurer la livraison de vos meubles via nos partenaires logistiques locaux.
                </p>
              </section>

              <section className="bg-[#FFCA68]/5 p-4 rounded-xl border border-[#FFCA68]/20">
                <h3 className="text-jet font-semibold mb-1">Sécurité de Paiement</h3>
                <p className="text-[13px]">
                  Nous ne stockons aucune information bancaire. Les transactions sont sécurisées par nos partenaires de paiement certifiés en Tunisie.
                </p>
              </section>

              <section>
                <h3 className="text-jet font-semibold mb-2 flex items-center gap-2">
                   <EyeOff size={16} className="text-[#FFCA68]" /> Vos Droits
                </h3>
                <p>
                  Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour toute demande, contactez notre service client à l&apos;adresse contact@miomondohome.com.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-jet/5 bg-white flex justify-end">
              <button
                onClick={onClose}
                className="bg-jet text-snow px-8 py-2.5 rounded-xl text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                J&apos;ai compris
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}