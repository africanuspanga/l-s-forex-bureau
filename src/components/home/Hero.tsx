import Image from "next/image";
import Link from "next/link";
import type { CurrencyRate } from "@/lib/rates";
import ExchangeCalculator from "@/components/ExchangeCalculator";

interface HeroProps {
  rates: CurrencyRate[];
}

export default function Hero({ rates }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-24">
      <div className="absolute inset-0">
        <Image
          src="/photos/hero-bridge.jpg"
          alt="Kigamboni Bridge, Dar es Salaam"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="hero-scrim absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="grid items-end gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up">
            <p className="eyebrow eyebrow-accent">Foreign Exchange — Dar es Salaam</p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Exchange Currency
              <br />
              <span className="text-accent">With Confidence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Get competitive foreign exchange rates and professional service at
              L&amp;S Forex Bureau. Check today&apos;s rates online, then visit
              your nearest L&amp;S branch to complete your exchange.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/rates" className="btn btn-accent">
                View Today&apos;s Rates
              </Link>
              <Link href="/branches" className="btn btn-ghost-light">
                Find a Branch
              </Link>
            </div>
            <p className="mt-8 flex items-center gap-2 text-sm text-white/60">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 shrink-0 text-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Tegeta • Mbezi Beach • Mikocheni • Masaki
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
            <ExchangeCalculator rates={rates} />
          </div>
        </div>
      </div>
    </section>
  );
}
