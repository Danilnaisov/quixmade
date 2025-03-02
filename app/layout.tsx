"use client";

import { Montserrat, Inter, Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

// Font configurations
const Font_Montserrat = Montserrat({
  variable: "--font-Montserrat",
  subsets: ["cyrillic"],
});

const MontserratAlternates = Montserrat_Alternates({
  variable: "--font-MontserratAlternates",
  subsets: ["cyrillic"],
  weight: ["400", "700", "800", "900"],
});

const Font_Inter = Inter({
  variable: "--font-Inter",
  subsets: ["cyrillic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${Font_Montserrat.variable} ${Font_Inter.variable} ${MontserratAlternates.variable} antialiased bg-white dark:bg-gray-900`}
      >
        <SessionProvider>{children}</SessionProvider>
        
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
