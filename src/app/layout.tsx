import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "@/features/shared/components/Providers";
import { MobileBottomNav } from "@/features/shared/components/MobileBottomNav";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Meer Hamza | Luxury Perfumes & Fragrances",
  description: "Exquisite scent collections crafted for the sophisticated mind. Experience the premium luxury fragrances of Meer Hamza.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans pb-16 md:pb-0" suppressHydrationWarning>
        <Providers>
          {children}
          <Suspense fallback={null}>
            <MobileBottomNav />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
