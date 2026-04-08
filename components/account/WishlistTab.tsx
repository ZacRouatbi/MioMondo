"use client";
import { useState, useEffect } from "react";

export default function WishlistTab({ customerId }: { customerId: number }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/account/wishlist?customer=${customerId}`)
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [customerId]);

  const removeItem = async (productId: number) => {
    await fetch(`/api/account/wishlist`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: customerId, product_id: productId }) });
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  if (loading) return <div className="p-10 text-center text-neutral-400 text-[14px]">Chargement…</div>;
  if (!items.length) return (
    <div className="text-center py-16">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.2" className="mx-auto mb-4 block"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
      <p className="text-[15px] font-medium text-jet mb-1">Liste vide</p>
      <p className="text-[13px] text-neutral-400">Ajoutez des articles à votre liste de souhaits</p>
    </div>
  );

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3.5">
      {items.map((item) => (
        <div key={item.product_id} className="bg-white border border-[#EEEEF5] rounded-2xl overflow-hidden relative group">
          <button onClick={() => removeItem(item.product_id)} className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white border border-[#EEEEF5] flex items-center justify-center cursor-pointer text-neutral-400 hover:text-red-500 transition-colors" title="Retirer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
          <div className="aspect-square bg-[#F7F7FA]">
            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#F0F0F5]" />}
          </div>
          <div className="p-3">
            <p className="text-[13px] font-medium text-jet m-0 mb-1 leading-tight">{item.name}</p>
            <p className="text-[13px] font-bold text-jet m-0">{parseFloat(item.price).toFixed(2)} DT</p>
          </div>
        </div>
      ))}
    </div>
  );
}