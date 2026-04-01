export default function LifestyleBanner() {
  return (
    /*
      Full-width 50/50 split — no inner wrapper so both panels bleed edge-to-edge.
      Text panel uses .inner-style padding so it matches other sections.
    */
    <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "clamp(320px, 44vw, 600px)" }}>

      {/* Text panel */}
      <div
        className="bg-jet flex flex-col justify-center"
        style={{ padding: "clamp(2.5rem, 6vw, 7rem) clamp(1.5rem, 5vw, 10rem)" }}
      >
        <p
          className="text-gold uppercase mb-6"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.22em" }}
        >
          ✦ Notre univers
        </p>
        <h2
          className="text-snow leading-[1.08] mb-5"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 3.8vw, 4.5rem)",
            fontWeight: 400,
          }}
        >
          Mio Mondo<br />Home
        </h2>
        <p
          className="text-snow opacity-50 leading-[1.75] mb-10"
          style={{ fontSize: "clamp(14px, 1.1vw, 17px)", maxWidth: "38ch" }}
        >
          Des collections soigneusement curatées pour sublimer chaque
          coin de votre intérieur — du salon à la terrasse.
        </p>
        <a
          href="/about"
          className="inline-flex items-center w-fit bg-gold text-jet px-8 py-4 text-[13px] font-semibold tracking-wide rounded-[4px] transition-colors duration-200 hover:bg-[#ffd980]"
        >
          Découvrir notre histoire →
        </a>
      </div>

      {/* Image — fills remaining half */}
      <div className="overflow-hidden min-h-[300px]">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=85"
          alt="Mio Mondo lifestyle"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
    </section>
  );
}
