const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  processing: { label: "En cours", color: "text-[#B07D00]", bg: "bg-[#FFFBEA]", dot: "bg-[#FFCA68]" },
  completed: { label: "Livrée", color: "text-[#1A6B3C]", bg: "bg-[#F0FBF4]", dot: "bg-[#4ADE80]" },
  cancelled: { label: "Annulée", color: "text-[#9B2626]", bg: "bg-[#FFF0F0]", dot: "bg-[#F87171]" },
  pending: { label: "En attente", color: "text-[#5A5A8A]", bg: "bg-[#F3F3FF]", dot: "bg-[#A5A5D8]" },
  "on-hold": { label: "En attente", color: "text-[#5A5A8A]", bg: "bg-[#F3F3FF]", dot: "bg-[#A5A5D8]" },
  refunded: { label: "Remboursée", color: "text-[#555]", bg: "bg-[#F5F5F5]", dot: "bg-[#999]" },
};

export default function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}