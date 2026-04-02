const ITEMS = [
  "Livraison gratuite dès 200 TND",
  "Nouveautés chaque semaine",
  "Fait avec amour à Sousse ✦",
  "Retours sous 14 jours",
  "Paiement sécurisé",
];

export default function MarqueeBanner() {
  return (
    <div className="bg-jet text-gold overflow-hidden py-[8px]">
      <div className="flex gap-16 whitespace-nowrap w-max animate-marquee">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="text-[11px] font-semibold tracking-[.15em] uppercase">
            {item}
            <span className="ml-8 opacity-40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
