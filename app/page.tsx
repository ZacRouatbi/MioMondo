import MarqueeBanner     from "@/components/layout/MarqueeBanner";
import Navbar            from "@/components/layout/Navbar";
import Hero              from "@/components/layout/Hero";
import CategoryGrid      from "@/components/shop/CategoryGrid";
import BestSellers       from "@/components/shop/BestSellers";
import LifestyleBanner   from "@/components/layout/LifestyleBanner";
import ValuesStrip       from "@/components/layout/ValuesStrip";
import NewsletterSection from "@/components/layout/NewsletterSection";
import Footer            from "@/components/layout/Footer";
export default function HomePage() {

  return (
    <>
  
      <MarqueeBanner />
      <Navbar />
      <main>
        <Hero />
        <BestSellers />
        <ValuesStrip />
        <LifestyleBanner />
        {/* <CategoryGrid /> */}

        <NewsletterSection />
      </main>
      <Footer />
     
    </>
  );
}