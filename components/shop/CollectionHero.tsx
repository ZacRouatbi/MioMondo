"use client";
import Image from "next/image";
interface CollectionHeroProps {
  activeTopLevel: { name: string } | null;
}

const headerImages: Record<string, string> = {
  Cuisine: "/Cuisine.jpg",
  "Art De Table": "/Art.jpg",
  Electroménager: "/Electromenager.jpg",
  "Maison et Décoration": "/Maison.jpg",
  "Salle De Bain": "/SalleDeBain.jpg",
  Default: "/Default.jpg", 
};

export default function CollectionHero({ activeTopLevel }: CollectionHeroProps) {
  const currentHeroImage = 
    headerImages[activeTopLevel?.name || ""] || headerImages["Default"];

  return (
    <section className="relative bg-jet overflow-hidden">
      {/* Layer 1: Decor */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#F8F8F8]/10 blur-3xl z-0" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-[#E6E6FA]/10 blur-2xl z-0" />

      {/* Layer 2: Image with Left-Side Fade Mask */}
      <div 
        className="absolute inset-y-0 right-0 w-full lg:w-2/3 h-full z-10"
        style={{
          // This creates the actual transparency fade on the image itself
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 40%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 40%)",
        }}
      >
       <Image
    src={currentHeroImage}
    alt={activeTopLevel?.name || "Mio Mondo Home Collections"}
    fill
    priority
    sizes="100vw"
    className="object-cover object-right"
  />
      </div>

      {/* Layer 3: Dark Gradient Overlay (For Text Contrast) */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: "linear-gradient(to right, rgba(26,26,46,1) 0%, rgba(26,26,46,0.8) 35%, transparent 100%)"
        }}
      />

      {/* Layer 4: Content */}
      <div className="relative z-30 max-w-7xl mx-auto px-5 lg:px-10 py-14 lg:py-20">
        <div className="max-w-xl">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#FFCA68] mb-3">
            MioMondo Home
          </p>
          
          <h1 className="font-display text-4xl lg:text-5xl font-light text-snow leading-tight">
            {activeTopLevel ? (
              <>
                <span className="text-[#E6E6FA]/40 text-3xl block mb-1">Collection</span>
                {activeTopLevel.name}
              </>
            ) : (
              <>
                Notre <em className="text-gold not-italic">Collection</em>
                <br />
                <span className="text-[#E6E6FA]/40 text-3xl font-light mt-1 block">Exclusive</span>
              </>
            )}
          </h1>

          <p className="mt-3 text-sm text-white/40 font-light max-w-sm">
            {activeTopLevel 
              ? `Découvrez notre sélection de produits pour sublimer votre ${activeTopLevel.name.toLowerCase()}.`
              : "Parcourez notre univers complet et trouvez les pièces parfaites pour chaque recoin de votre maison."
            }
          </p>
        </div>
      </div>
    </section>
  );
}