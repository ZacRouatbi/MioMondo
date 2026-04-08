export type TabType = "orders" | "info" | "wishlist" | "payment";

export default function AccountHero({ tab }: { tab: TabType }) {
  const LABELS: Record<TabType, string> = {
    orders: "Mes Commandes",
    info: "Informations Personnelles",
    wishlist: "Liste de Souhaits",
    payment: "Moyens de Paiement",
  };
  
  return (
    <div className="bg-[#F7F7FA] border-b border-[#EEEEF5] pt-14 pb-10 text-center">
      <h1 className="font-serif text-[clamp(28px,5vw,42px)] font-normal tracking-wider text-jet mb-2">
        MON COMPTE
      </h1>
      <p className="text-[15px] text-neutral-500 mb-4 font-normal">{LABELS[tab]}</p>
      <nav className="text-[11px] text-neutral-300 tracking-widest uppercase flex items-center justify-center gap-2">
        <a href="/" className="text-neutral-300 no-underline hover:text-jet transition-colors">Accueil</a>
        <span className="text-neutral-300">›</span>
        <span className="text-jet">{LABELS[tab]}</span>
      </nav>
    </div>
  );
}