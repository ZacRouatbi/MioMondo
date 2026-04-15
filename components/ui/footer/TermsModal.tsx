"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Truck, CreditCard, Scale, Info } from "lucide-react";
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-jet/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header — Consistent Mio Mondo Style */}
            <div className="p-6 md:p-8 border-b border-jet/5 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFCA68]/20 flex items-center justify-center">
                  <Scale size={24} className="text-jet" />
                </div>
                <h2 className={`${lora.className} text-2xl text-jet font-medium`}>
                  Conditions <em className="text-[#FFCA68]">Générales</em>
                </h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-jet/5 rounded-full transition-colors">
                <X size={24} className="text-jet/50" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8 sm:p-12 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="space-y-10">
                
                <section className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-[#F7F7FA] flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-jet" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">1. Objet</h4>
                    <p className="text-[15px] text-neutral-500 leading-relaxed">
                      Les présentes conditions régissent la vente des produits présentés sur <strong>Mio Mondo Home</strong>. En passant commande, vous acceptez sans réserve ces termes.
                    </p>
                  </div>
                </section>

                <section className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-[#F7F7FA] flex items-center justify-center shrink-0">
                    <CreditCard size={18} className="text-jet" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">2. Prix et Paiement</h4>
                    <p className="text-[15px] text-neutral-500 leading-relaxed">
                      Tous nos prix sont indiqués en <strong>Dinars Tunisiens (TND)</strong>. Nous acceptons le paiement par carte bancaire (ClicToPay) et le paiement à la livraison.
                    </p>
                  </div>
                </section>

                <section className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-[#F7F7FA] flex items-center justify-center shrink-0">
                    <Truck size={18} className="text-jet" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">3. Livraison</h4>
                    <p className="text-[15px] text-neutral-500 leading-relaxed">
                      Livraison sur toute la Tunisie sous 3 à 7 jours ouvrables. Le client est tenu de vérifier l&apos;état du produit en présence du livreur.
                    </p>
                  </div>
                </section>

                {/* Styled Highlight Box */}
                <div className="bg-jet rounded-2xl p-6 flex gap-4 items-start border border-jet">
                   <Info size={20} className="text-[#FFCA68] shrink-0 mt-1" />
                   <div>
                      <h4 className="text-[#FFCA68] text-[12px] font-bold uppercase tracking-[0.1em] mb-1">Note Importante</h4>
                      <p className="text-snow/70 text-[14px] leading-relaxed">
                        Pour les articles volumineux, des frais de livraison spécifiques peuvent s&apos;appliquer selon votre gouvernorat.
                      </p>
                   </div>
                </div>

              </div>
            </div>

            {/* Footer Bottom Branding */}
            <div className="p-6 border-t border-jet/5 bg-white flex justify-center shrink-0">
              <p className="text-[10px] text-jet/20 uppercase tracking-[0.4em]">
                Mio Mondo Home Boutique
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}