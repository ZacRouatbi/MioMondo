import Link from "next/link";

export function StockBadge({ status }: { status: string }) {
  const config = {
    instock:     { label: "En stock", dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50" },
    outofstock:  { label: "Rupture de stock", dot: "bg-red-400", text: "text-red-700", bg: "bg-red-50" },
    onbackorder: { label: "Sur commande", dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
  }[status] ?? { label: status, dot: "bg-jet/30", text: "text-jet/60", bg: "bg-jet/5" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function PriceDisplay({ price, regular_price, on_sale }: {
  price: string; regular_price: string; on_sale: boolean;
}) {
  const current = parseFloat(price) || 0;
  const regular = parseFloat(regular_price) || 0;
  const discount = on_sale && regular > current ? Math.round(((regular - current) / regular) * 100) : 0;

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className="font-display text-4xl font-light text-jet tracking-tight">
        {current.toFixed(2)} <span className="text-xl ml-1.5 text-jet/40 font-light">TND</span>
      </span>
      {on_sale && regular > current && (
        <>
          <span className="text-xl text-jet/30 line-through font-light">{regular.toFixed(2)} TND</span>
          <span className="text-sm font-bold bg-[#FFCA68] text-jet px-2.5 py-0.5 rounded-full">-{discount}%</span>
        </>
      )}
    </div>
  );
}

export function TrustBadges() {
  const badges = [
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, label: "Livraison rapide" },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, label: "Paiement sécurisé" },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>, label: "Retour facile" }
  ];
  return (
    <div className="grid grid-cols-3 gap-3 pt-2">
      {badges.map((b) => (
        <div key={b.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-[#E6E6FA]/60 text-center">
          <span className="text-[#FFCA68]">{b.icon}</span>
          <span className="text-[10px] font-medium text-jet/50 leading-tight">{b.label}</span>
        </div>
      ))}
    </div>
  );
}