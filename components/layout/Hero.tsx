export default function Hero() {
  return (
    /*
      Full viewport-width section — NO inner wrapper here.
      The image bleeds edge-to-edge. Text uses .inner padding
      so it lines up with every other section on large screens.
    */
    <section className="relative w-full overflow-hidden bg-snow h-[91dvh]">
      {/* Full-bleed photo */}
      <img
        src="/heroImage.jpg"
        alt="Mio Mondo Home — interior lifestyle"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Left-to-right white fade so text pops */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(248,248,248,.95) 0%, rgba(248,248,248,.78) 30%, rgba(248,248,248,.25) 58%, transparent 75%)",
        }}
      />

      {/* Text */}
      <div className="inner relative z-10 h-full flex flex-col justify-center">
        <p className="uppercase text-jet opacity-45 mb-6 text-[11px] font-semibold tracking-[0.24em]">
          Collection 2026
        </p>

        <h1
          className="text-jet leading-[1.06] mb-8 font-[family-name:var(--font-display)] text-[clamp(2.6rem,5.5vw,6rem)] font-normal max-w-[12ch]"
        >
          Bring the Mio&nbsp;Mondo
          <br />
          <em className="italic font-light">experience</em> home
        </h1>

        <div className="flex flex-wrap gap-4">
          <a
            href="/shop"
            className="inline-flex items-center justify-center bg-gold text-jet border border-gold px-8 py-4 text-[13px] font-semibold tracking-wide rounded-[4px] transition-all duration-200 hover:bg-jet hover:text-gold hover:border-jet whitespace-nowrap"
          >
            Shop Now
          </a>
          <a
            href="/shop?view=collections"
            className="inline-flex items-center justify-center bg-transparent text-jet border border-jet/30 px-8 py-4 text-[13px] font-medium tracking-wide rounded-[4px] transition-all duration-200 hover:border-jet whitespace-nowrap"
          >
            Explore Collections
          </a>
        </div>
      </div>
    </section>
  );
}