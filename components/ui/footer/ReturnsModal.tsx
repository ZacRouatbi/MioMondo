"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, PackageCheck, AlertCircle } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500"] });

export default function ReturnsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-jet/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header — Matched with ContactModal style */}
          <div className="p-6 md:p-8 border-b border-jet/5 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFCA68]/20 flex items-center justify-center">
                <RotateCcw size={24} className="text-jet" />
              </div>
              <h2 className={`${lora.className} text-2xl text-jet font-medium`}>
                Politique de <em className="text-[#FFCA68]">retour</em>
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
                  <RotateCcw size={18} className="text-jet" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">Délai de rétractation</h4>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    Conformément à la loi tunisienne, vous disposez d'un délai de <strong>10 jours</strong> à compter de la réception de votre commande pour demander un échange ou un avoir.
                  </p>
                </div>
              </section>

              <section className="flex gap-6">
                <div className="w-10 h-10 rounded-full bg-[#F7F7FA] flex items-center justify-center shrink-0">
                  <PackageCheck size={18} className="text-jet" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">Conditions de retour</h4>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    Les articles doivent être retournés dans leur <strong>emballage d'origine</strong>, non utilisés et accompagnés de la facture. Les articles endommagés par le client ne seront pas acceptés.
                  </p>
                </div>
              </section>

              <section className="flex gap-6">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <AlertCircle size={18} className="text-orange-600" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">Exceptions</h4>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    Pour des raisons d'hygiène, les articles de linge de maison déballés ne peuvent être retournés. Les articles en promotion ne sont ni échangeables ni remboursables.
                  </p>
                </div>
              </section>
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
    </AnimatePresence>
  );
}