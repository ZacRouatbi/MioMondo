const VALUES = [
  {
    title: "Free Delivery",
    desc:  "On all orders over 200 TND",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
  {
    title: "Curated Quality",
    desc:  "Every piece hand-selected",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  {
    title: "Easy Returns",
    desc:  "Hassle-free within 14 days",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.94"/></svg>,
  },
  {
    title: "Secure Payment",
    desc:  "100% protected transactions",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  },
];

export default function ValuesStrip() {
  return (
    <section className="bg-lavender py-14 lg:py-18 xl:py-20">
      <div className="inner">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 xl:gap-16">
          {VALUES.map(v => (
            <div key={v.title} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-snow flex items-center justify-center text-jet flex-shrink-0 shadow-sm">
                {v.icon}
              </div>
              <p className="text-jet font-semibold" style={{ fontSize: "clamp(13px,1.1vw,16px)" }}>
                {v.title}
              </p>
              <p className="text-jet opacity-50 leading-relaxed" style={{ fontSize: "clamp(12px,0.9vw,14px)" }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
