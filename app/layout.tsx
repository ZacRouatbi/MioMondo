import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { CartProvider } from "@/components/cart/CartContext";
import { AuthModalProvider } from "@/components/ui/auth/AuthModalContext";

export const metadata: Metadata = {
  title: "Mio Mondo Home — Décoration Intérieure",
  description: "Votre boutique de décoration intérieure à Sousse. Collections exclusives, livraison Tunisie.",
  icons: {
    icon: "/favicon.ico",
  },
};

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
        {/* Move Providers (QueryClient) to the top level */}
        <Providers>
          <CartProvider>
            <main>
              
           <AuthModalProvider>
            {children}
          </AuthModalProvider>
              </main>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}