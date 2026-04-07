import Footer from "@/components/layout/Footer";
import MarqueeBanner from "@/components/layout/MarqueeBanner";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";

export default function AboutPage() {
  return (
    
    <main className="w-full overflow-hidden">
              <MarqueeBanner />
              <Navbar />
      <section className="relative w-full overflow-hidden bg-snow h-[91dvh]">
      <Image
    src="/OurStory.png"
    alt="Mio Mondo atelier"
    fill
    sizes="100vw"
    priority={true}
    loading="eager" 
    className="object-cover"
  />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, rgba(248,248,248,.95) 0%, rgba(248,248,248,.78) 35%, rgba(248,248,248,.25) 65%, transparent 85%)",
        }}
      />

      {/* 3. Text Content: Aligned to the right using 'items-end' and 'text-right' */}
      <div className="inner relative z-10 h-full flex flex-col justify-center items-end text-right">
        
        <p className="uppercase text-jet opacity-45 mb-6 text-[11px] font-semibold tracking-[0.24em]">
          Our Story
        </p>

        <h1
          className="text-jet leading-[1.06] mb-8 font-[family-name:var(--font-display)] text-[clamp(2.4rem,5vw,5.5rem)] font-normal max-w-[15ch]"
        >
          Crafted with <em className="italic font-light">intention</em>,
          <br />
          lived with ease
        </h1>

        <p className="text-jet/60 text-[15px] font-light leading-[1.8] mb-10 max-w-[42ch]">
          Mio Mondo was born from a belief that your home should feel like a
          sanctuary — not a showroom. We source each piece with a careful eye
          for material, maker, and meaning.
        </p>

        <a
          href="#philosophy"
          className="inline-flex items-center justify-center bg-gold text-jet border border-gold px-10 py-4 text-[13px] font-semibold tracking-wide rounded-[4px] transition-all duration-200 hover:bg-jet hover:text-gold hover:border-jet"
        >
          Our Philosophy
        </a>
      </div>
    </section>

      {/* ─── 2. DARK STATS STRIP ────────────────────────────────────── */}
      <section className="bg-jet grid grid-cols-1 md:grid-cols-3">
        {[
          {
            num: "2014",
            label: "Founded",
            body: "From a small studio to homes across the region — a decade of curating beauty.",
          },
          {
            num: "120+",
            label: "Artisan Partners",
            body: "Every maker we work with shares our commitment to slow craft and honest materials.",
          },
          {
            num: "100%",
            label: "Considered Sourcing",
            body: "We trace every piece to its origin. If we wouldn't place it in our home, we won't sell it.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="px-10 py-14 border-b md:border-b-0 md:border-r border-white/[0.07] last:border-0"
          >
            <p
              className="font-[family-name:var(--font-display)] font-light text-[#FFCA68] mb-2"
              style={{ fontSize: "clamp(2rem, 3vw, 2.8rem)" }}
            >
              {item.num}
            </p>
            <p className="uppercase text-white/35 text-[10px] font-semibold tracking-[0.22em] mb-3">
              {item.label}
            </p>
            <p className="text-white/50 text-[13px] font-light leading-[1.8]">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      {/* ─── 3. FOUNDER STORY ───────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[560px]">

        {/* Left — copy on warm off-white */}
        <div className="bg-[#F0ECE6] flex flex-col justify-center px-12 py-20 md:px-16 lg:px-20 order-2 md:order-1">
          <p className="uppercase text-[#1a1a2e]/40 text-[10px] font-semibold tracking-[0.26em] mb-6">
            How it began
          </p>

          <h2
            className="text-[#1a1a2e] font-[family-name:var(--font-display)] font-light leading-[1.1] mb-8"
            style={{ fontSize: "clamp(2rem, 3.2vw, 3rem)", maxWidth: "16ch" }}
          >
            A love letter to the{" "}
            <em className="italic">art of living</em>
          </h2>

          <p className="text-[#1a1a2e]/60 text-[14px] font-light leading-[1.9] mb-4 max-w-[44ch]">
            Our founder spent years traveling through Europe and North Africa,
            collecting objects that told a story — ceramics from Nabeul, linens
            from Brittany, hand-blown glass from Morocco.
          </p>
          <p className="text-[#1a1a2e]/60 text-[14px] font-light leading-[1.9] max-w-[44ch]">
            What began as a personal obsession became a curation practice, and
            eventually, a home.
          </p>
        </div>

        {/* Right — full-bleed photo */}
        <div className="relative min-h-[50vw] md:min-h-0 order-1 md:order-2">
          <Image
            src="/Philosophy.png"
            alt="Philosophy image"
            fill
            //className="object-contain object-center"
          />
        </div>
      </section>


      {/* ─── 5. PHILOSOPHY + STATS ──────────────────────────────────── */}
      <section id="philosophy" className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">

        {/* Left — gold background */}
        <div className="bg-[#FFCA68] flex flex-col justify-center px-12 py-20 md:px-16 lg:px-20">
          <p className="uppercase text-[#1a1a2e]/45 text-[10px] font-semibold tracking-[0.26em] mb-6">
            What we believe
          </p>
          <h2
            className="text-[#1a1a2e] font-[family-name:var(--font-display)] font-light leading-[1.1] mb-8"
            style={{ fontSize: "clamp(2rem, 3.2vw, 3rem)", maxWidth: "16ch" }}
          >
            Beauty that <em className="italic">lasts</em>
            <br />
            beyond the season
          </h2>
          <p className="text-[#1a1a2e]/70 text-[14px] font-light leading-[1.9] max-w-[42ch]">
            We reject the throwaway. Every item is chosen because it will still
            feel right five, ten, twenty years from now — heirlooms in waiting.
          </p>
        </div>

        {/* Right — dark grid of stats */}
        <div className="bg-jet grid grid-cols-2">
          {[
            { num: "12",  label: "Countries of origin" },
            { num: "0",   label: "Fast-fashion partners" },
            { num: "3×",  label: "Quality checks per piece" },
            { num: "∞",   label: "Returns accepted" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col justify-end px-10 py-12 border-b border-r border-white/[0.07] [&:nth-child(2)]:border-r-0 [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0 [&:nth-child(4)]:border-r-0"
            >
              <p
                className="font-[family-name:var(--font-display)] font-light text-[#FFCA68] leading-none mb-2"
                style={{ fontSize: "clamp(2.4rem, 3.5vw, 3.2rem)" }}
              >
                {stat.num}
              </p>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/35">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. CTA SECTION ─────────────────────────────────────────── */}
      <section className="bg-[#E6E6FA]/40 flex flex-col items-center justify-center text-center px-8 py-24">
        <p className="uppercase text-[#1a1a2e]/40 text-[10px] font-semibold tracking-[0.26em] mb-6">
          Make it yours
        </p>

        <h2
          className="font-[family-name:var(--font-display)] font-light text-[#1a1a2e] leading-[1.1] mb-6"
          style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)", maxWidth: "22ch" }}
        >
          Ready to bring the{" "}
          <em className="italic">Mio Mondo</em> feeling home?
        </h2>

        <p className="text-[#1a1a2e]/55 text-[14px] font-light leading-[1.9] max-w-[48ch] mb-10">
          Browse our latest collection or book a complimentary styling
          consultation with one of our team members.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/products"
            className="inline-flex items-center justify-center bg-jet text-[#F8F8F8] border border-jet text-[11px] font-semibold tracking-[0.18em] uppercase px-10 py-4 rounded-[3px] transition-all duration-200 hover:bg-[#FFCA68] hover:text-jet hover:border-[#FFCA68]"
          >
            Shop the Collection
          </a>

        </div>
      </section>
      <Footer />

    </main>
  );
}