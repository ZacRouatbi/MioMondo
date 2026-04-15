"use client";

import { useState } from "react"; // Added
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser"; 
import { useAuthModal } from "@/components/ui/auth/AuthModalContext"; 
import PrivacyModal from "@/components/ui/footer/PrivacyModal";
import TermsModal from "@/components/ui/footer/TermsModal";

const LINKS = [
  {
    col: "Shop",
    items: [
      { label: "Art De Table", slug: "art-de-table" },
      { label: "Cuisine", slug: "cuisine" },
      { label: "Maison et Décoration", slug: "maison-et-decoration" },
      { label: "Salle De Bain", slug: "salle-de-bain" },
      { label: "Electroménager", slug: "electromenager" },
    ],
  },
  {
    col: "Votre Compte",
    items: [
      { label: "Informations personnelles", slug: "info" },
      { label: "Commandes", slug: "orders" },
      { label: "Ma liste de souhaits", slug: "wishlist" },
    ],
  },
  {
    col: "Entreprise",
    items: [
      { label: "Politique de retour", slug: "returns" },
      { label: "Politique de Confidentialité", slug: "privacy" },
      { label: "Conditions d'utilisation", slug: "terms" },
      { label: "Contactez-nous", slug: "contact" },
    ],
  },
];

export default function Footer() {
  const router = useRouter();
  const { data: session } = useUser();
  const { openAuthModal } = useAuthModal();

  // Modal States
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleAccountLink = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    if (session?.authenticated) {
      router.push(`/account?view=${slug}`);
    } else {
      openAuthModal();
    }
  };

  // Logic to intercept Enterprise links
  const handleEnterpriseLink = (e: React.MouseEvent, slug: string) => {
    if (slug === "privacy") {
      e.preventDefault();
      setShowPrivacy(true);
    } else if (slug === "terms") {
      e.preventDefault();
      setShowTerms(true);
    }
    // contact and returns will follow standard link behavior
  };

  return (
    <footer className="bg-jet text-snow">
      <div className="inner" style={{ paddingTop: "clamp(3.5rem, 6vw, 6rem)" }}>
        <div className="grid grid-cols-2 md:grid-cols-[2.5fr_1fr_1fr_1fr] gap-10 lg:gap-16 xl:gap-20 pb-14 border-b border-white/[.08]">
          
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-snow tracking-[.04em] leading-none mb-1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,2vw,30px)", fontWeight: 500 }}>
              Mio Mondo
            </div>
            <div className="text-snow opacity-35 uppercase mb-6" style={{ fontSize: 8, letterSpacing: "0.45em" }}>HOME</div>
            <p className="text-snow opacity-40 leading-[1.75] mb-6" style={{ fontSize: "clamp(13px,1vw,15px)", maxWidth: "32ch" }}>
              Your home décor boutique in Sousse. Style, quality and passion since 2018.
            </p>
            <p className="text-gold opacity-80 leading-[2]" style={{ fontSize: "clamp(12px,0.9vw,14px)" }}>
              📍 Blvd 14 Janvier, Medina City, Sousse<br />
              📞 +216 73 273 241
            </p>
          </div>

          {/* Links Sections */}
          {LINKS.map(({ col, items }) => (
            <div key={col}>
              <h4 className="text-snow uppercase mb-5" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em" }}>
                {col}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {items.map((item: any, idx) => {
                  const isAccount = col === "Votre Compte";
                  const isShop = col === "Shop";
                  const isEnterprise = col === "Entreprise";

                  if (isAccount) {
                    return (
                      <li key={idx}>
                        <button
                          onClick={(e) => handleAccountLink(e, item.slug)}
                          className="text-snow opacity-40 hover:opacity-100 transition-opacity duration-200 text-left"
                          style={{ fontSize: "clamp(13px,1vw,15px)" }}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  }

                  let href = "#";
                  if (isShop) href = `/products?category=${item.slug}`;
                  if (isEnterprise) href = `/${item.slug}`;

                  return (
                    <li key={idx}>
                      <Link
                        href={href}
                        onClick={(e) => isEnterprise && handleEnterpriseLink(e, item.slug)}
                        className="text-snow opacity-40 hover:opacity-100 transition-opacity duration-200"
                        style={{ fontSize: "clamp(13px,1vw,15px)" }}
                      >
                        {item.label || item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="text-snow opacity-25" style={{ fontSize: 12 }}>
            © 2026 Mio Mondo Home. All rights reserved. Made with ❤️ by <span className="text-[#FFCA68]">Brand</span>box agency.
          </p>
          <div className="flex gap-6">
            {["Facebook", "Instagram", "TikTok"].map(s => (
              <a key={s} href="#" className="text-snow opacity-35 hover:text-gold hover:opacity-100 transition-all duration-200" style={{ fontSize: 12, letterSpacing: "0.04em" }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </footer>
  );
}