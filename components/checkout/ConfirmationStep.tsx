"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MapPin, Clock, Truck, MessageCircle } from "lucide-react";

interface Props {
  orderId: number;
  onContinue: () => void;
  paymentMethod: "cod" | "clictopay" | "pay_sur_place"; // Added this prop
}

export function ConfirmationStep({ orderId, onContinue, paymentMethod }: Props) {
  const isPickup = paymentMethod === "pay_sur_place";
  const [timeLeft, setTimeLeft] = useState("02:00:00");

  // Simple countdown logic for the 2-hour window
  useEffect(() => {
    if (!isPickup) return;
    
    const target = new Date().getTime() + 2 * 60 * 60 * 1000;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        clearInterval(interval);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPickup]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <div className="bg-snow border border-[#EEEEF5] rounded-3xl p-8 sm:p-12 text-center shadow-sm">
        
        {/* Animated checkmark */}
        <div className="w-20 h-20 rounded-full bg-[#F0FBF4] border border-[#C6F0D6] flex items-center justify-center mx-auto mb-6">
          <motion.svg
            width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A6B3C" strokeWidth="2.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>

        <h2 className="font-serif text-[24px] sm:text-[30px] font-medium text-jet mb-3 tracking-tight">
          {isPickup ? "Réservation confirmée !" : "Commande confirmée !"}
        </h2>
        
        <p className="text-[14px] text-neutral-500 mb-1 max-w-md mx-auto">
          Merci pour votre confiance. Votre commande <span className="font-bold text-jet">#{orderId}</span> est en cours de préparation.
        </p>

        {/* Conditional "Pay Sur Place" Alert */}
        {isPickup && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="mt-6 mb-8 p-6 bg-[#FFCA68]/10 border border-[#FFCA68]/30 rounded-2xl inline-block w-full max-w-sm"
          >
            <div className="flex items-center justify-center gap-2 text-jet mb-2">
              <Clock size={18} className="animate-pulse" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Temps restant pour le retrait</span>
            </div>
            <div className="text-3xl font-mono font-bold text-jet tracking-widest">
              {timeLeft}
            </div>
            <p className="text-[11px] text-jet/60 mt-2 leading-relaxed">
              Veuillez vous présenter au magasin de Sousse avant l&apos;expiration de ce délai pour maintenir votre réservation.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 mt-8">
          {[
            { 
              label: isPickup ? "Point de Retrait" : "Traitement", 
              value: isPickup ? "Medina City, Sousse" : "1–2 jours ouvrés", 
              icon: isPickup ? <MapPin size={18}/> : "📋" 
            },
            { 
              label: isPickup ? "Paiement" : "Livraison", 
              value: isPickup ? "Sur place (Espèces/TPE)" : "3–5 jours ouvrés", 
              icon: isPickup ? <Clock size={18}/> : <Truck size={18}/> 
            },
            { 
              label: "Besoin d'aide ?", 
              value: "+216 73 273 241", 
              icon: <MessageCircle size={18}/> 
            },
          ].map(({ label, value, icon }, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 p-5 bg-white border border-[#EEEEF5] rounded-2xl">
              <span className="text-[#FFCA68] mb-1">{icon}</span>
              <p className="text-[10px] font-bold tracking-[0.1em] text-neutral-400 uppercase">{label}</p>
              <p className="text-[12px] font-semibold text-jet text-center">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/account?view=orders"
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-jet text-white text-[13px] font-bold hover:opacity-90 transition-all shadow-md shadow-jet/10"
          >
            Suivre ma commande
          </Link>
          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-10 py-3.5 rounded-2xl border border-jet/10 text-jet text-[13px] font-bold hover:bg-jet/[0.02] transition-colors cursor-pointer"
          >
            Continuer mes achats
          </button>
        </div>
        
        {isPickup && (
          <a 
            href="https://goo.gl/maps/your-actual-link-here" 
            target="_blank" 
            className="inline-block mt-6 text-[11px] text-[#FFCA68] font-bold underline underline-offset-4 hover:text-jet transition-colors"
          >
            Ouvrir l&apos;itinéraire vers le magasin
          </a>
        )}
      </div>
    </motion.div>
  );
}