import type { Metadata } from "next";
import { Suspense } from "react";
import { Cinzel, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/features/shared/components/Providers";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://timelessbymeer.com"),
  title: {
    default: "Timeless by Meer | Luxury Perfumes & Fragrances Store Pakistan",
    template: "%s | Timeless by Meer"
  },
  description: "Experience Pakistan's premium luxury perfume brand by Meer Hamza. Shop original, long-lasting signature fragrances crafted in Sargodha, Punjab. Nationwide express delivery.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
  },
  keywords: [
    "Timeless by Meer", "Timeless Perfumes", "Meer Hamza Perfumes", "Luxury Perfumes Pakistan",
    "Premium Perfumes Pakistan", "Best Perfumes Pakistan", "Online Perfume Store Pakistan",
    "Long Lasting Perfumes Pakistan", "Sargodha Perfume Store", "Pakistani Perfume Brand"
  ],
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Timeless by Meer | Luxury Perfumes & Fragrances Store Pakistan",
    description: "Experience Pakistan's premium luxury perfume brand by Meer Hamza. Shop original, long-lasting signature fragrances crafted in Sargodha, Punjab. Nationwide express delivery.",
    url: "https://timelessbymeer.com",
    siteName: "Timeless by Meer",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Timeless by Meer Logo"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Timeless by Meer | Luxury Perfumes & Fragrances Store Pakistan",
    description: "Experience Pakistan's premium luxury perfume brand by Meer Hamza. Shop original, long-lasting signature fragrances crafted in Sargodha, Punjab. Nationwide express delivery.",
    images: ["/logo.png"],
  },
};

import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html
      lang="en"
      nonce={nonce}
      className={`h-full antialiased ${cinzel.variable} ${cormorant.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
