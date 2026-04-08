import Link from "next/link";

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
    items: ["Informations personnelles", "Commandes", "Ma liste de souhaits"],
  },
  {
    col: "Entreprise",
    items: ["Politique de retour", "Politique de Confidentialité", "Conditions d'utilisation", "Contactez-nous"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-jet text-snow">
      <div
        className="inner"
        style={{ paddingTop: "clamp(3.5rem, 6vw, 6rem)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-[2.5fr_1fr_1fr_1fr] gap-10 lg:gap-16 xl:gap-20 pb-14 border-b border-white/[.08]">
          
          <div className="col-span-2 md:col-span-1">
            <div
              className="text-snow tracking-[.04em] leading-none mb-1"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,2vw,30px)", fontWeight: 500 }}
            >
              Mio Mondo
            </div>
            <div className="text-snow opacity-35 uppercase mb-6" style={{ fontSize: 8, letterSpacing: "0.45em" }}>
              HOME
            </div>
            <p
              className="text-snow opacity-40 leading-[1.75] mb-6"
              style={{ fontSize: "clamp(13px,1vw,15px)", maxWidth: "32ch" }}
            >
              Your home décor boutique in Sousse. Style, quality and passion since 2018.
            </p>
            <p className="text-gold opacity-80 leading-[2]" style={{ fontSize: "clamp(12px,0.9vw,14px)" }}>
              📍 Blvd 14 Janvier, Medina City, Sousse<br />
              📞 +216 73 273 241
            </p>
          </div>

          {LINKS.map(({ col, items }) => (
            <div key={col}>
              <h4
                className="text-snow uppercase mb-5"
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em" }}
              >
                {col}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {items.map((item, idx) => {
                  const isShop = col === "Shop";
                  const label = isShop ? (item as any).label : item;
                  const href = isShop ? `/products?category=${(item as any).slug}` : "#";

                  return (
                    <li key={idx}>
                      <Link
                        href={href}
                        className="text-snow opacity-40 hover:opacity-100 transition-opacity duration-200"
                        style={{ fontSize: "clamp(13px,1vw,15px)" }}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="text-snow opacity-25" style={{ fontSize: 12 }}>
            © 2026 Mio Mondo Home. All rights reserved. Made with ❤️ by <span className="text-[#FFCA68]">Brand</span>box agency.
          </p>
          <div className="flex gap-6">
            {["Facebook", "Instagram", "TikTok"].map(s => (
              <a key={s} href="#"
                className="text-snow opacity-35 hover:text-gold hover:opacity-100 transition-all duration-200"
                style={{ fontSize: 12, letterSpacing: "0.04em" }}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}