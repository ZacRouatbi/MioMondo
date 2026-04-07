'use client';

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import AuthModal from "./../ui/auth/AuthModal";
import SearchModal from "./../ui/SearchModal";
import UserDropdown from "./../ui/auth/UserDropdown";
import { useUser } from "@/hooks/useUser";
import { useCartContext } from "../cart/CartContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Collections", href: "/shop?view=collections" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modals & Dropdown State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: session } = useUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Cart count from context ──────────────────────────────────────────────
  const { itemCount } = useCartContext();

  // 1. Handle scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 2. Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleAccountClick = () => {
    if (session?.authenticated) {
      setIsProfileOpen(!isProfileOpen);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-snow border-b border-[#202C39]/[.08] transition-all duration-300 ${
          scrolled ? "shadow-[0_4px_24px_rgba(32,44,57,.08)] py-2" : "py-1"
        }`}
      >
        <div className="inner">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-72px">

            {/* ── Left: Desktop Nav ── */}
            <nav className="flex items-center">
              <div className="hidden md:flex items-center gap-8 xl:gap-12">
                {NAV_LINKS.map(l => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="relative py-1 h-fit text-[13px] text-jet opacity-70 hover:opacity-100 transition-all duration-300 group"
                  >
                    <span className="group-hover:text-[#FFCA68] transition-colors duration-300">
                      {l.label}
                    </span>
                    <span className="absolute bottom-[2px] left-0 w-0 h-[1.5px] bg-[#FFCA68] transition-all duration-300 ease-out group-hover:w-full" />
                  </a>
                ))}
              </div>

              <button
                onClick={() => setMobileOpen(true)}
                className="flex md:hidden flex-col justify-center gap-[5px] w-8 h-8 bg-transparent border-0 cursor-pointer p-0 group"
              >
                <span className="block w-6 h-px bg-jet group-hover:bg-[#FFCA68] transition-colors" />
                <span className="block w-6 h-px bg-jet group-hover:bg-[#FFCA68] transition-colors" />
                <span className="block w-4 h-px bg-jet group-hover:w-6 group-hover:bg-[#FFCA68] transition-all" />
              </button>
            </nav>

            {/* ── Center: Logo ── */}
            <a href="/" className="text-center select-none group">
              <span
                className="block text-jet tracking-[.05em] leading-none transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,1.8vw,28px)", fontWeight: 500 }}
              >
                Mio Mondo
              </span>
              <span className="flex items-center justify-center gap-2 mt-1">
                <span className="block h-px w-5 bg-jet opacity-25 group-hover:bg-[#FFCA68] group-hover:opacity-100 transition-all" />
                <span className="text-[8px] tracking-[.4em] text-jet opacity-40 uppercase group-hover:text-[#FFCA68] group-hover:opacity-100 transition-all">HOME</span>
                <span className="block h-px w-5 bg-jet opacity-25 group-hover:bg-[#FFCA68] group-hover:opacity-100 transition-all" />
              </span>
            </a>

            {/* ── Right: Icons ── */}
            <div className="flex items-center justify-end gap-5 xl:gap-7">

              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center justify-center w-8 h-8 flex-shrink-0 text-jet opacity-60 hover:text-[#FFCA68] hover:opacity-100 transition-all duration-300 hover:scale-110 outline-none"
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5 aspect-square">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              {/* Account / Profile Trigger */}
              <div className="relative flex-shrink-0" ref={dropdownRef}>
                <button
                  onClick={handleAccountClick}
                  className={`flex items-center justify-center w-8 h-8 flex-shrink-0 transition-all duration-300 hover:scale-110 outline-none ${
                    session?.authenticated
                      ? "text-[#FFCA68] opacity-100"
                      : "text-jet opacity-60 hover:text-[#FFCA68] hover:opacity-100"
                  }`}
                  aria-label="Account"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5 aspect-square flex-shrink-0">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>

                <AnimatePresence>
                  {isProfileOpen && session?.user && (
                    <UserDropdown
                      user={session.user}
                      onLogout={handleLogout}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* ── Cart icon with live count ── */}
              <a
                href="/cart"
                className="relative flex items-center justify-center w-8 h-8 flex-shrink-0 text-jet opacity-60 hover:text-[#FFCA68] hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-5 h-5 aspect-square">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>

                {/* Badge — only renders when cart has items */}
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FFCA68] text-jet text-[9px] font-bold w-[17px] h-[17px] rounded-full flex items-center justify-center shadow-sm">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </a>
            </div>

          </div>
        </div>
      </header>

      {/* ── Modals Area ── */}
      <AnimatePresence mode="wait">
        {isSearchModalOpen && (
          <SearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
          />
        )}

        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed inset-0 z-[300] bg-snow flex flex-col p-10 gap-8 transition-transform duration-500 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="self-end text-[24px] text-jet opacity-50 hover:text-[#FFCA68] transition-colors"
        >✕</button>

        {NAV_LINKS.map((l, i) => (
          <a
            key={l.label}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className="text-jet border-b border-[#202C39]/10 pb-6 transition-all hover:pl-4 hover:text-[#FFCA68] hover:border-[#FFCA68]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px,6vw,40px)",
              fontWeight: 400,
              transitionDelay: `${i * 50}ms`,
            }}
          >
            {l.label}
          </a>
        ))}

        {session?.authenticated && (
          <div className="mt-auto p-6 bg-lavender/30 rounded-2xl">
            <p className="text-[10px] uppercase tracking-widest text-jet/40 font-bold mb-1">Logged in as</p>
            <p className="text-jet font-medium mb-4 truncate">{session.user.email}</p>
            <button
              onClick={handleLogout}
              className="text-sm font-bold text-[#FFCA68] underline underline-offset-4"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </>
  );
}