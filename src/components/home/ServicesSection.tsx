import Link from "next/link";

const SMALL_CARDS = [
  {
    title: "Major Global Currencies",
    copy: "Exchange commonly requested international currencies including USD, EUR, GBP, CAD, AUD, CHF, CNY and SAR.",
  },
  {
    title: "Regional Currencies",
    copy: "Convenient exchange for regional currencies including KES, UGX and ZAR.",
  },
  {
    title: "Large Transactions",
    copy: "For larger currency requirements, customers may contact an L&S branch beforehand to confirm availability and the applicable rate.",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">What We Do</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Straightforward Foreign Exchange
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl bg-brand-gradient p-8 card-shadow-lg sm:p-10 lg:row-span-1">
            <div>
              <p className="eyebrow-light text-xs font-bold uppercase tracking-[0.1em] text-white/70">
                Core Service
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white">
                Foreign Currency Exchange
              </h3>
              <p className="mt-3 leading-relaxed text-white/80">
                Buy or sell major international and regional currencies against
                Tanzanian Shillings through an L&amp;S branch. Whether you are
                travelling, returning home, conducting business or simply need
                foreign currency, our team is ready to assist you.
              </p>
            </div>
            <Link href="/services" className="btn btn-white mt-8 w-fit">
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
                className="card animate-fade-up p-6"
                style={{ animationDelay: `${i * 90}ms`, borderLeftWidth: "2px", borderLeftColor: "var(--color-primary)" }}
              >
                <h3 className="font-display text-base font-bold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
