"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Truck, CreditCard } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500"] });

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: Props) {
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
                  <FileText size={22} className="text-jet" />
                </div>
                <h2 className={`${lora.className} text-xl text-jet font-medium`}>
                  Conditions d&apos;Utilisation
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-jet/5 rounded-full transition-colors">
                <X size={20} className="text-jet/50" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto text-sm text-jet/70 leading-relaxed space-y-6">
              <section>
                <h3 className="text-jet font-semibold mb-2">1. Objet</h3>
                <p>
                  Les présentes conditions régissent la vente des produits présentés sur Mio Mondo Home. En passant commande, vous acceptez sans réserve ces termes.
                </p>
              </section>

              <section>
                <h3 className="text-jet font-semibold mb-2 flex items-center gap-2">
                  <CreditCard size={16} className="text-[#FFCA68]" /> 2. Prix et Paiement
                </h3>
                <p>
                  Tous nos prix sont indiqués en Dinars Tunisiens (TND) toutes taxes comprises (TTC). Nous acceptons le paiement par carte bancaire et le **paiement à la livraison**.
                </p>
              </section>

              <section>
                <h3 className="text-jet font-semibold mb-2 flex items-center gap-2">
                  <Truck size={16} className="text-[#FFCA68]" /> 3. Livraison
                </h3>
                <p>
                  La livraison est assurée sur tout le territoire tunisien. Les délais varient généralement entre 3 et 7 jours ouvrables. Le client est tenu de vérifier l&apos;état du produit en présence du livreur.
                </p>
              </section>

              <section className="bg-jet text-snow p-5 rounded-xl">
                <h3 className="text-[#FFCA68] font-semibold mb-2 text-sm uppercase tracking-wider">Note Importante</h3>
                <p className="text-[13px] opacity-80">
                  En raison de la nature volumineuse de certains meubles, des frais de livraison spécifiques peuvent s&apos;appliquer selon votre région (Grand Tunis, Sahel, Sud, etc.).
                </p>
              </section>

              <section>
                <h3 className="text-jet font-semibold mb-2">4. Retours et Rétractation</h3>
                <p>
                  Conformément au code de la protection du consommateur en Tunisie, vous disposez d&apos;un délai légal pour retourner un produit dans son emballage d&apos;origine, sous conditions de conformité.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-jet/5 bg-white flex justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-jet text-snow px-8 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-jet/90 transition-colors"
              >
                Accepter les conditions
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}