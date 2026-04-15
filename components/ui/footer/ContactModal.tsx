"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { Lora } from "next/font/google";

const lora = Lora({ subsets: ["latin"], weight: ["400", "500"] });

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: Props) {
  const address = "Mio Mondo Home, Boulevard 14 janvier, 2011 route touristique khezama, Sousse 4057, Tunisie";
  const fallbackEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

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
            className="relative w-full max-w-5xl bg-snow rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header — Fixed with new Typo style */}
            <div className="p-6 md:p-8 border-b border-jet/5 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFCA68]/20 flex items-center justify-center">
                  <MapPin size={24} className="text-jet" />
                </div>
                <h2 className={`${lora.className} text-2xl text-jet font-medium`}>
                  Contactez <em className="text-[#FFCA68]">Mio Mondo</em>
                </h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-jet/5 rounded-full transition-colors">
                <X size={24} className="text-jet/50" />
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Left: Info Section - Card Feeling Restored */}
                <div className="p-8 lg:p-12 space-y-6">
                  
                  {/* Address Card */}
                  <div className="bg-snow/3 p-6 rounded-2xl border border-jet/5">
                    <h3 className="text-jet font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MapPin size={14} className="text-[#FFCA68]" /> Adresse
                    </h3>
                    <p className="text-[14px] text-jet/70 leading-relaxed">
                      Boulevard 14 janvier, 2011<br /> 
                      Route touristique Khezama,<br /> 
                      Sousse 4057, Tunisie
                    </p>
                  </div>

                  {/* Phone Card */}
                  <div className="bg-snow/3 p-6 rounded-2xl border border-jet/5">
                    <h3 className="text-jet font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Phone size={14} className="text-[#FFCA68]" /> Téléphone
                    </h3>
                    <p className="text-[14px] text-jet font-medium">+216 53 773 241</p>
                  </div>

                  {/* Hours Card */}
                  <div className="bg-snow/3 p-6 rounded-2xl border border-jet/5">
                    <h3 className="text-jet font-bold text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Clock size={14} className="text-[#FFCA68]" /> Horaires de réception
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[14px]">
                        <span className="text-jet/60">Lun — Sam</span>
                        <span className="text-jet font-medium">09:00 - 19:30</span>
                      </div>
                      <div className="flex justify-between text-[14px]">
                        <span className="text-jet/60">Dimanche</span>
                        <span className="text-jet font-medium">Fermé</span>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <a 
                    href={googleMapsLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 mt-4 rounded-xl text-[14px] font-bold tracking-wider uppercase transition-all duration-300 bg-jet text-snow hover:bg-[#FFCA68] hover:text-jet shadow-xl"
                  >
                    Itinéraire Google Maps <ExternalLink size={16} />
                  </a>
                </div>

                {/* Right: Map Section - Kept exactly as provided */}
                <div className="p-4 md:p-8 md:pl-0 h-[450px] md:h-auto">
                  <div className="w-full h-full rounded-2xl overflow-hidden border border-jet/5 shadow-inner relative group">
                    <iframe 
                      src={fallbackEmbed}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mio Mondo Home Location"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-jet/5 bg-white flex justify-center">
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