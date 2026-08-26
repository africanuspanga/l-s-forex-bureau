import type { Metadata } from "next";
import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/rates";

export const metadata: Metadata = {
  title: "Foreign Exchange Services | L&S Forex Bureau",
  description:
    "Straightforward foreign exchange services at L&S Forex Bureau branches across Dar es Salaam.",
};

const SERVICES = [
  {
    title: "Foreign Currency Exchange",
    copy: "Buy or sell major international and regional currencies against Tanzanian Shillings through an L&S branch. Whether you are travelling, returning home, conducting business or simply need foreign currency, our team is ready to assist you.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m3-12L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    ),
  },
  {
    title: "Major Global Currencies",
    copy: "L&S branches deal in the world's most traded international currencies, including USD, EUR, GBP, CAD, AUD, CHF, CNY and SAR.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.5 0 4.5-4 4.5-9S14.5 3 12 3m0 18c-2.5 0-4.5-4-4.5-9S9.5 3 12 3M3.6 9h16.8M3.6 15h16.8"
      />
    ),
  },
  {
    title: "Regional Currencies",
    copy: "Exchange East and Southern African currencies against Tanzanian Shillings at any L&S branch, including KES, UGX and ZAR.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7.5-5.6-7.5-11.25a7.5 7.5 0 0 1 15 0C19.5 15.4 12 21 12 21Z"
      />
    ),
    extraIcon: <circle cx="12" cy="9.75" r="2.5" />,
  },
  {
    title: "Large Transactions",
    copy: "For larger currency requirements, customers may contact an L&S branch beforehand to confirm availability and the applicable rate.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 17.25h4.5V9.75H3v7.5Zm6.75 0H14.25V3H9.75v14.25Zm6.75 0H21V6.75H16.5v10.5Z"
      />
    ),
    extraIcon: null,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero band */}
      <section className="bg-hero-mesh pt-24">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            What We Do
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Straightforward Foreign Exchange
          </h1>
        </div>
      </section>

      {/* Services */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {SERVICES.map((service) => (
              <div key={service.title} className="card p-8">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {service.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted">{service.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-brand-gradient px-6 py-14 text-center sm:px-12 lg:py-20">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Need Foreign Currency Today?
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/rates" className="btn btn-white">
                Check Exchange Rates
              </Link>
              <a href={`tel:${PHONE_TEL}`} className="btn btn-ghost-light">
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
