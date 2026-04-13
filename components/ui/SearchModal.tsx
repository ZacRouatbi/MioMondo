"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { X, Search, Loader2 } from "lucide-react";
import debounce from "lodash.debounce";
import { Product } from "@/types/product";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fetchSearchResults = async (query: string): Promise<Product[]> => {
  if (!query) return [];
  const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Search failed");
  return response.json();
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 2. Debounce Logic
  const debouncedSetSearch = useCallback(
    debounce((nextValue: string) => setDebouncedSearchTerm(nextValue), 400),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSetSearch(value);
  };

  // 3. Data Fetching
  const { data: results, isLoading, isError } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: () => fetchSearchResults(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 3,
    staleTime: 1000 * 60 * 5,
  });

  // 4. Focus, Keyboard & Scroll Lock Logic
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-6 lg:p-12">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-jet/60 backdrop-blur-md cursor-pointer"
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 lg:top-10 lg:right-10 p-3 rounded-full text-snow/70 hover:text-snow hover:bg-snow/10 transition-all z-20"
      >
        <X size={24} />
      </button>

      {/* Main Content */}
      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl z-10 flex flex-col items-center max-h-[90vh]"
      >
        <div className="w-full relative mb-12">
          <label className="text-[10px] tracking-[.4em] uppercase text-snow font-bold mb-4 block text-center opacity-80">
            Search our Collections
          </label>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-jet/30" size={26} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="E.g., Scandinavian Sofa, Minimalist Lamp..."
              className="w-full pl-16 pr-20 py-6 bg-snow border border-jet/10 rounded-full text-xl lg:text-3xl text-jet placeholder:text-jet/20 focus:outline-none focus:border-[#FFCA68] focus:shadow-[0_0_60px_rgba(255,202,104,0.1)] transition-all"
              style={{ fontFamily: 'var(--font-display)' }}
            />
            {isLoading && debouncedSearchTerm.length >= 3 && (
              <Loader2 className="absolute right-7 top-1/2 -translate-y-1/2 text-[#FFCA68] animate-spin" size={24} />
            )}
          </div>
        </div>

        <div className="w-full overflow-y-auto custom-scrollbar px-2">
          <AnimatePresence mode="wait">
            {debouncedSearchTerm.length < 3 && (
              <motion.p key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-snow/70 italic text-center text-lg">
                Type at least 3 characters to begin...
              </motion.p>
            )}

            {isError && (
              <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[#FFCA68] text-center text-lg">
                Connection error. Please try again.
              </motion.p>
            )}

            {results && results.length === 0 && !isLoading && debouncedSearchTerm.length >= 3 && (
              <motion.p key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-snow italic text-center text-lg">
                No products found matching "{debouncedSearchTerm}".
              </motion.p>
            )}

            {results && results.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 pb-10"
              >
                {results.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="group flex flex-col bg-snow rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border border-jet/5"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-[#F8F9FA]">
                      {product.image?.[0] ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.1]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-jet/10 uppercase text-[8px] tracking-[.3em]">No Image</div>
                      )}
                    </div>
                    <div className="p-4 flex-grow border-t border-jet/[0.03]">
                      <h4 className="text-[12px] text-jet font-medium tracking-wide uppercase line-clamp-1 group-hover:text-[#FFCA68] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[13px] font-semibold text-jet mt-1">
                        {product.price} <span className="text-[9px] opacity-60">TND</span>
                      </p>
                    </div>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}