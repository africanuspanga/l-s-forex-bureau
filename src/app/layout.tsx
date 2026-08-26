import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PHONE_TEL } from "@/lib/format";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "L&S Forex Bureau | Foreign Exchange in Dar es Salaam",
  description:
    "Check today's foreign exchange rates and visit L&S Forex Bureau in Tegeta, Mbezi Beach, Mikocheni or Masaki, Dar es Salaam.",
  metadataBase: new URL("https://www.lsforexbureau.co.tz"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "L&S Forex Bureau",
  description:
    "Professional foreign currency exchange services across Dar es Salaam.",
  telephone: "+255743881309",
  areaServed: "Dar es Salaam, Tanzania",
  branch: [
    { "@type": "FinancialService", name: "L&S Forex Bureau, Tegeta" },
    { "@type": "FinancialService", name: "L&S Forex Bureau, Mbezi Beach" },
    { "@type": "FinancialService", name: "L&S Forex Bureau, Mikocheni" },
    { "@type": "FinancialService", name: "L&S Forex Bureau, Masaki" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton phone={PHONE_TEL.replace("+", "")} />
        <MobileBottomNav
          items={[
            { href: "/", label: "Home", icon: "home" },
            { href: "/rates", label: "Rates", icon: "rates" },
            { href: "/branches", label: "Branches", icon: "branches" },
            { href: "/contact", label: "Contact", icon: "contact" },
          ]}
        />
      </body>
    </html>
  );
}
