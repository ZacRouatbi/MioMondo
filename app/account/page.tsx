"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";

// Components
import Navbar from "@/components/layout/Navbar";
import LoadingScreen from "@/components/account/LoadingScreen";
import MarqueeBanner from "@/components/layout/MarqueeBanner";
import Footer from "@/components/layout/Footer";
import AccountHero, { TabType } from "@/components/account/AccountHero";
import OrdersTab from "@/components/account/OrdersTab";
import InfoTab from "@/components/account/InfoTab";
import WishlistTab from "@/components/account/WishlistTab";
import PaymentTab from "@/components/account/PaymentTab";

// Icons
import { LogOut } from "lucide-react";

const NAV_ITEMS: { id: TabType; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  {
    id: "orders",
    label: "Mes Commandes",
    shortLabel: "Commandes",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    id: "info",
    label: "Informations",
    shortLabel: "Infos",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: "wishlist",
    label: "Liste de Souhaits",
    shortLabel: "Souhaits",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: "payment",
    label: "Moyens de Paiement",
    shortLabel: "Paiement",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
];

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isLoading: isAuthLoading } = useUser();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [isMinimumWaitDone, setIsMinimumWaitDone] = useState(false);

  const customerId = session?.user?.id;

  useEffect(() => {
    const view = searchParams.get("view") as TabType;
    const validTabs: TabType[] = ["orders", "info", "wishlist", "payment"];
    if (view && validTabs.includes(view)) setActiveTab(view);
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMinimumWaitDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMinimumWaitDone && !isAuthLoading && !session?.authenticated) {
      router.push("/");
    }
  }, [session, isAuthLoading, isMinimumWaitDone, router]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    router.push(`/account?view=${tab}`, { scroll: false });
  };

  if (isAuthLoading || !isMinimumWaitDone) return <LoadingScreen />;
  if (!session?.authenticated || !customerId) return null;

  return (
    <>
      <AccountHero tab={activeTab} />

      <div className="md:hidden bg-[#FAFAFA] border-b border-[#EEEEF5]">
        <div className="mobile-nav-scroll flex overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-semibold whitespace-nowrap transition-all flex-1 cursor-pointer border-b-2 ${
                  isActive
                    ? "border-jet text-jet"
                    : "border-transparent text-neutral-400 hover:text-jet"
                }`}
              >
                <span className={isActive ? "text-[#FFCA68]" : "text-neutral-300"}>
                  {item.icon}
                </span>
                {item.shortLabel}
              </button>
            );
          })}

          <button
            onClick={() => logout()}
            className="flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-semibold whitespace-nowrap border-b-2 border-transparent text-[#C0A0A0] flex-1 cursor-pointer hover:text-red-400 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Sortir
          </button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-5 py-6 sm:py-10 pb-16 sm:pb-20 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <aside className="hidden md:block w-[220px] shrink-0 sticky top-[100px]">
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-2.5 p-[11px_16px] rounded-xl border-none text-[13px] cursor-pointer text-left transition-all group ${
                    isActive
                      ? "bg-jet text-white font-semibold shadow-md"
                      : "bg-transparent text-neutral-400 font-normal hover:bg-neutral-100 hover:text-jet"
                  }`}
                >
                  <span className={`shrink-0 transition-colors ${isActive ? "text-[#FFCA68]" : "text-neutral-300 group-hover:text-jet/50"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}

            <div className="mt-6 pt-5 border-t border-[#EEEEF5]">
              <button
                onClick={() => logout()}
                className="flex items-center gap-2.5 p-[11px_16px] rounded-xl border-none bg-transparent text-[#C0A0A0] text-[13px] cursor-pointer w-full text-left hover:bg-red-50/50 transition-colors group"
              >
                <LogOut size={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === "orders"   && <OrdersTab   customerId={customerId} />}
              {activeTab === "info"     && <InfoTab     customerId={customerId} />}
              {activeTab === "wishlist" && <WishlistTab  customerId={customerId} />}
              {activeTab === "payment"  && <PaymentTab  />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap');
        .mobile-nav-scroll::-webkit-scrollbar { display: none; }
        .mobile-nav-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <MarqueeBanner />
      <Navbar />
      
      <Suspense fallback={<LoadingScreen />}>
        <AccountContent />
      </Suspense>

      <Footer />
    </div>
  );
}