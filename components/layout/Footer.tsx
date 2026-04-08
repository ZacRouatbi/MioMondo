const LINKS = [
  {
    col: "Shop",
    items: ["Art De Table", "Cuisine","Maison et Décoration", "Salle De Bain","Electroménager"],
  },
  {
    col: "Votre Compte",
    items: ["Informations personnelles", "Commandes", "Mes listes de souhaits"],
  },
  {
    col: "Entreprise",
    items: ["Politique de retour","Politique de Confidentialité","Conditions d'utilisation","Contactez-nous"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-jet text-snow">
      <div
        className="inner"
        style={{ paddingTop: "clamp(3.5rem, 6vw, 6rem)" }}
      >

        {/* Main grid: brand wide left, 3 link columns right */}
        <div className="grid grid-cols-2 md:grid-cols-[2.5fr_1fr_1fr_1fr] gap-10 lg:gap-16 xl:gap-20 pb-14 border-b border-white/[.08]">

          {/* Brand */}
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

          {/* Link columns */}
          {LINKS.map(({ col, items }) => (
            <div key={col}>
              <h4
                className="text-snow uppercase mb-5"
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em" }}
              >
                {col}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-snow opacity-40 hover:opacity-100 transition-opacity duration-200"
                      style={{ fontSize: "clamp(13px,1vw,15px)" }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="text-snow opacity-25" style={{ fontSize: 12 }}>
            © 2026 Mio Mondo Home. All rights reserved. Made with ❤️ by <span className="text-#FFCA68">Brand</span><span className="text-snow">box agency</span>.
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
