export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#EEEEF5] rounded-2xl p-[22px_24px]">
      <p className="text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase m-0 mb-4.5">
        {title}
      </p>
      {children}
    </div>
  );
}