import Link from "next/link";

const ITEMS = [
  {
    title: "Transparent Rates",
    copy: "Clearly displayed buying and selling rates so customers can understand the exchange before completing their transaction.",
  },
  {
    title: "Convenient Locations",
    copy: "Four branches strategically located across Dar es Salaam.",
  },
  {
    title: "Professional Service",
    copy: "A straightforward branch experience designed to make currency exchange easy.",
  },
  {
    title: "Trusted & Regulated",
    copy: "L&S Forex Bureau operates within Tanzania's regulated foreign exchange sector.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-primary-deep px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Why L&amp;S
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Foreign Exchange Without the Complexity
              </h2>
              <Link
                href="/branches"
                className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary-deep transition hover:bg-accent-soft"
              >
                Visit L&amp;S Today
              </Link>
            </div>

            <ul className="grid gap-8 sm:grid-cols-2">
              {ITEMS.map((item, i) => (
                <li key={item.title} className="animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-accent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
