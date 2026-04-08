"use client";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "./StatusBadge";
import { ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";



export default function OrdersTab({ customerId }: { customerId: number }) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["account", "orders", customerId, page],
    queryFn: async () => {
      const res = await fetch(`/api/account/orders?customer=${customerId}&page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<{ orders: Order[]; totalPages: number }>;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });

  // Pre-fetch the next page for instant transitions
  useEffect(() => {
    if (!isPlaceholderData && data?.totalPages && page < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["account", "orders", customerId, page + 1],
        queryFn: async () => {
          const res = await fetch(`/api/account/orders?customer=${customerId}&page=${page + 1}`);
          return res.json();
        },
      });
    }
  }, [data, page, queryClient, customerId, isPlaceholderData]);

  if (isLoading) return <OrdersSkeleton />;

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  if (!orders.length && page === 1) return <EmptyOrders />;

  return (
    <div className="flex flex-col gap-4">
      <div className={`flex flex-col gap-3 transition-opacity duration-300 ${isPlaceholderData ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {orders.map((order) => {
          const isOpen = expanded === order.id;
          const date = new Date(order.date_created).toLocaleDateString("fr-TN", { 
            day: "numeric", month: "long", year: "numeric" 
          });

          return (
            <div key={order.id} className="bg-white border border-[#EEEEF5] rounded-2xl overflow-hidden hover:shadow-sm transition-all">
              <div className="p-[18px_22px] flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold tracking-[0.15em] text-jet uppercase">CMD #{order.number}</span>
                  <span className="text-[12px] text-neutral-400 font-medium">{date}</span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <StatusBadge status={order.status} />
                  <span className="text-[14px] font-bold text-jet">{parseFloat(order.total).toFixed(2)} DT</span>
                  <button 
                    onClick={() => setExpanded(isOpen ? null : order.id)} 
                    className={`px-5 py-2 rounded-full border border-[#E6E6FA] text-[12px] font-bold cursor-pointer transition-all ${isOpen ? 'bg-jet text-white border-jet' : 'bg-white text-jet hover:bg-neutral-50'}`}
                  >
                    {isOpen ? "Fermer" : "Détails"}
                  </button>
                </div>
              </div>

              {/* Quick View Thumbnails */}
              {!isOpen && (
                <div className="px-[22px] pb-5 flex gap-2">
                  {order.line_items.slice(0, 5).map((item, i) => (
                    <div key={i} className="w-[48px] h-[48px] rounded-xl bg-[#F7F7FA] border border-[#EEEEF5] overflow-hidden shrink-0">
                      {item.image?.src ? (
                        <img src={item.image.src} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F0F0F5]">
                          <PackageOpen size={16} className="text-neutral-300" />
                        </div>
                      )}
                    </div>
                  ))}
                  {order.line_items.length > 5 && (
                    <div className="w-[48px] h-[48px] rounded-xl bg-neutral-50 border border-[#EEEEF5] flex items-center justify-center text-[11px] text-neutral-500 font-bold">
                      +{order.line_items.length - 5}
                    </div>
                  )}
                </div>
              )}

              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#FAFAFB] border-t border-[#EEEEF5]"
                  >
                    <div className="p-[20px_22px]">
                      <p className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase mb-4">Détails du panier</p>
                      <div className="flex flex-col gap-3">
                        {order.line_items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border border-[#EEEEF5] overflow-hidden shrink-0">
                              <img src={item.image?.src} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="text-[13px] font-semibold text-jet line-clamp-1">{item.name}</span>
                              <span className="text-[11px] text-neutral-400">Quantité: {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Premium Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <button 
            disabled={page === 1}
            onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 text-[12px] font-bold text-jet disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft size={16} /> Précédent
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-full text-[12px] font-bold transition-all ${page === i + 1 ? 'bg-jet text-white shadow-lg scale-110' : 'text-neutral-400 hover:text-jet'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={page === totalPages}
            onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 text-[12px] font-bold text-jet disabled:opacity-30 cursor-pointer"
          >
            Suivant <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="text-center py-20 bg-white border border-dashed border-[#E6E6FA] rounded-3xl">
      <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-5">
        <PackageOpen size={28} className="text-neutral-300" strokeWidth={1.5} />
      </div>
      <p className="text-[16px] font-bold text-jet mb-1">Aucune commande trouvée</p>
      <p className="text-[13px] text-neutral-400">Vos futurs achats Mio Mondo s'afficheront ici.</p>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-[#EEEEF5] rounded-2xl p-[22px]">
          <div className="flex justify-between mb-4">
            <div className="w-[140px] h-4 bg-[#F0F0F5] rounded-md animate-pulse" />
            <div className="w-24 h-4 bg-[#F0F0F5] rounded-md animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((j) => <div key={j} className="w-[48px] h-[48px] rounded-xl bg-[#F7F7FA] animate-pulse" />)}
          </div>
        </div>
      ))}
    </div>
  );
}