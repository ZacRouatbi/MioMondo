import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
// import Navbar from "@/components/Navbar"; // Assuming your Navbar is here
import { CartProvider } from "@/components/cart/CartContext";
export const metadata: Metadata = {
  title: "Mio Mondo Home — Décoration Intérieure",
  description: "Votre boutique de décoration intérieure à Sousse. Collections exclusives, livraison Tunisie.",
  // Good for SEO/Mobile
  icons: {
    icon: "/favicon.ico",
  },
};

// Ensures the site looks right on mobile notches and high-res screens
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F8F8", // Matches your 'snow' background
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body 
        className="antialiased selection:bg-gold/20 selection:text-jet"
        style={{ backgroundColor: "var(--color-snow)" }}
      >
        <Providers>
          {/* Usually, you'd place the Navbar here so it's consistent 
             across all pages and stays sticky relative to the viewport.
          */}
          {/* <Navbar /> */}
          
          <main>
             <CartProvider>
            {children}
            </CartProvider>
          </main>
          
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}