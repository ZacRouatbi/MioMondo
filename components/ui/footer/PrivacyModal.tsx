"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500"] });

export default function PrivacyModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
          {/* Header — Now using the "Returns" style trick */}
          <div className="p-6 md:p-8 border-b border-jet/5 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFCA68]/20 flex items-center justify-center">
                <ShieldCheck size={24} className="text-jet" />
              </div>
              <h2 className={`${lora.className} text-2xl text-jet font-medium`}>
                Confidenti<em className="text-[#FFCA68]">alité</em>
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
                  <Lock size={18} className="text-jet" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">Protection des données</h4>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    Chez <strong>Mio Mondo</strong>, nous protégeons vos informations personnelles. Vos données de paiement sont cryptées via le protocole SSL et ne sont jamais stockées sur nos serveurs.
                  </p>
                </div>
              </section>

              <section className="flex gap-6">
                <div className="w-10 h-10 rounded-full bg-[#F7F7FA] flex items-center justify-center shrink-0">
                  <EyeOff size={18} className="text-jet" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">Usage des informations</h4>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    Nous utilisons vos coordonnées uniquement pour le traitement de vos commandes et pour vous offrir une expérience d'achat personnalisée dans notre boutique de Sousse.
                  </p>
                </div>
              </section>

              <section className="flex gap-6">
                <div className="w-10 h-10 rounded-full bg-[#F7F7FA] flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-jet" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-jet mb-2 uppercase tracking-wider">Vos Droits</h4>
                  <p className="text-[15px] text-neutral-500 leading-relaxed">
                    Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande, contactez notre service client.
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