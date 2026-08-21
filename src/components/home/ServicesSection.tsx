import Link from "next/link";

const SMALL_CARDS = [
  {
    title: "Major Global Currencies",
    copy: "Exchange commonly requested international currencies including USD, EUR, GBP, CAD, AUD, CHF, CNY and SAR.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.3 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.3-3.8-8.5s1.3-6.1 3.8-8.5z" />
      </svg>
    ),
  },
  {
    title: "Regional Currencies",
    copy: "Convenient exchange for regional currencies including KES, UGX and ZAR.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Large Transactions",
    copy: "For larger currency requirements, customers may contact an L&S branch beforehand to confirm availability and the applicable rate.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10m5.5 10V4M15 20v-8m5 8V7" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-primary/10 bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            What We Do
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Straightforward Foreign Exchange
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-3xl bg-brand-gradient p-8 card-shadow-lg sm:p-10 lg:row-span-1">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V8m0 0L4 11m3-3l3 3m7-3v8m0 0l3-3m-3 3l-3-3" />
                </svg>
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
                Foreign Currency Exchange
              </h3>
              <p className="mt-3 leading-relaxed text-white/80">
                Buy or sell major international and regional currencies against
                Tanzanian Shillings through an L&amp;S branch. Whether you are
                travelling, returning home, conducting business or simply need
                foreign currency, our team is ready to assist you.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-surface"
            >
              Explore our services
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-6">
            {SMALL_CARDS.map((card, i) => (
              <div
                key={card.title}
                className="animate-fade-up flex gap-4 rounded-2xl border border-primary/5 bg-white p-6 card-shadow transition-transform hover:-translate-y-1"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {card.icon}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{card.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
