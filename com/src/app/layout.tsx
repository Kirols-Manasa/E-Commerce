 import { type Metadata } from "next";
import "@/styles/globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import SmoothScroll from "@/LinesScroll";
import CustomScrollbar from "@/CustomScrollbar";
import GridOverlay from "@/GridOverlay";
import Header from "@/layout/Header/Header";
import Footer from "@/layout/Header/footer/footer";
import { WishlistProvider, CartProvider } from "@/sections/cart.tsx/cart";

export const metadata: Metadata = {
  title: {
    default: "AURA — Elevated Fashion",
    template: "%s | AURA",
  },
  description:
    "Discover AURA — a curated collection of premium men's and women's fashion, accessories, and footwear. Refined essentials for those who dress with intention.",

  authors: [{ name: "Kirols Manasa" }],
  creator: "Kirols Manasa",
  publisher: "AURA",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AURA",
    title: "AURA — Elevated Fashion",
    description:
      "Discover AURA — a curated collection of premium men's and women's fashion, accessories, and footwear. Refined essentials for those who dress with intention.",
    images: [
      {
        url: "/favicon.ico",
        width: 32,
        height: 32,
        alt: "AURA — Elevated Fashion",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AURA — Elevated Fashion",
    description:
      "Discover AURA — a curated collection of premium men's and women's fashion, accessories, and footwear.",
    images: ["/favicon.ico"],
    creator: "@KirolsManasa",
  },

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],

  applicationName: "AURA",
  category: "fashion",
  keywords: [
    "AURA",
    "fashion",
    "luxury fashion",
    "men fashion",
    "women fashion",
    "accessories",
    "shoes",
    "premium clothing",
    "elevated style",
  ],
};

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="font-[family-name:var(--font-inter)]">
        <TRPCReactProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <SmoothScroll>
                {children}
              </SmoothScroll>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </TRPCReactProvider>
        <CustomScrollbar />
        <GridOverlay />
      </body>
    </html>
  );
}