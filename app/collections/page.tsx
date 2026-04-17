'use client';

import Footer from "@/components/layout/Footer";
import MarqueeBanner from "@/components/layout/MarqueeBanner";
import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    id: "salle-de-bain",
    title: "Salle de Bain",
    slug: "salle-de-bain",
    imageSrc: "/salle-de-bain.jpg",
  },
  {
    id: "cuisine",
    title: "Cuisine",
    slug: "cuisine",
    imageSrc: "/cuisine1.jpg",
  },
  {
    id: "electromenager",
    title: "Électroménager",
    slug: "electromenager",
    imageSrc: "/Electromenager.jpg",
  },
  {
    id: "maison-decoration",
    title: "Maison & Décoration",
    slug: "maison-et-decoration",
    imageSrc: "/Maison.jpg",
  },
];

const featuredCollection = {
  title: "Art de Table",
  slug: "art-de-table",
  imageSrc: "/Art1.jpg",
};

export default function CollectionsPage() {
  return (
    <>
      <MarqueeBanner />
      <Navbar />

      <main className="relative min-h-screen bg-[#F8F8F8] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

        {/* Top-LEFT leaf */}
        <div
          className="pointer-events-none absolute -top-20 -left-40 w-[580px] md:w-[680px] h-[580px] md:h-[680px] rotate-180"
          style={{
            opacity: 0.45,
            maskImage: `
              linear-gradient(to right, black 45%, transparent 95%),
              linear-gradient(to top, black 55%, transparent 90%)
            `,
            WebkitMaskImage: `
              linear-gradient(to right, black 45%, transparent 95%),
              linear-gradient(to top, black 55%, transparent 90%)
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <Image src="/leaves_linesgold.png" alt="" fill className="object-contain" priority />
        </div>

        {/* Bottom-RIGHT leaf */}
        <div
          className="pointer-events-none absolute -bottom-20 -right-40 w-[580px] md:w-[680px] h-[580px] md:h-[680px]"
          style={{
            opacity: 0.55,
            maskImage: `
              linear-gradient(to left, black 45%, transparent 95%),
              linear-gradient(to top, black 55%, transparent 90%)
            `,
            WebkitMaskImage: `
              linear-gradient(to left, black 45%, transparent 95%),
              linear-gradient(to top, black 55%, transparent 90%)
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <Image src="/leaves_linesgold.png" alt="" fill className="object-contain" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif text-jet tracking-[0.15em] uppercase">
              Découvrez Nos Collections
            </h1>
            <div className="w-[70dvh] h-[2px] bg-[#FFCA68] mx-auto mt-6" />
          </div>

          {/* Featured: Art de Table - Navigates to /products with category param */}
          <Link href={`/products?category=${featuredCollection.slug}`} className="group block mb-12">
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500">
              <div className="grid md:grid-cols-2">
                <div className="relative h-[300px] md:h-[420px] overflow-hidden">
                  <Image
                    src={featuredCollection.imageSrc}
                    alt={featuredCollection.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-lavender/10 mix-blend-multiply" />
                </div>
                <div className="flex flex-col justify-center px-8 md:px-12 py-10 text-jet">
                  <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-wide mb-4">
                    {featuredCollection.title}
                  </h2>
                  <p className="text-lg opacity-80 mb-6 font-medium">
                    L'élégance à chaque repas
                  </p>
                  <p className="text-sm opacity-60 mb-8 max-w-md leading-relaxed">
                    Découvrez notre sélection raffinée de vaisselle, couverts et verrerie pour sublimer vos moments de partage.
                  </p>
                  <div>
                    <span className="inline-flex items-center justify-center bg-[#FFCA68] text-jet px-8 py-4 text-[12px] font-bold tracking-[0.2em] uppercase rounded-[4px] transition-all duration-300 group-hover:bg-jet group-hover:text-[#FFCA68]">
                      Explorer la collection
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* 2x2 Grid - Navigates to /products with category param */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/products?category=${collection.slug}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-500 bg-white">
                  <div className="relative h-[300px] overflow-hidden">
                    <Image
                      src={collection.imageSrc}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jet/80 via-jet/20 to-transparent opacity-80" />
                  </div>
                  <div className="absolute bottom-0 w-full p-8 text-white">
                    <h3 className="text-2xl font-serif tracking-wide uppercase mb-3">
                      {collection.title}
                    </h3>
                    <span className="text-[#FFCA68] text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                      Découvrir
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}