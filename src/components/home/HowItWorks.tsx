import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Check Today's Rate",
    copy: "View the latest L&S buying and selling rates online.",
  },
  {
    number: "02",
    title: "Find Your Nearest Branch",
    copy: "Choose from Tegeta, Mbezi Beach, Mikocheni or Masaki.",
  },
  {
    number: "03",
    title: "Visit L&S",
    copy: "Bring the currency you wish to exchange together with any identification or supporting documents required for your transaction.",
  },
  {
    number: "04",
    title: "Exchange & Receive Your Receipt",
    copy: "Our team completes the transaction at the confirmed rate and provides your transaction receipt.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-primary/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Simple &amp; Straightforward
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Exchange Currency in Four Simple Steps
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="animate-fade-up rounded-2xl border border-primary/5 bg-white p-6 card-shadow transition-transform hover:-translate-y-1"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="font-display text-4xl font-bold text-gradient">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/branches"
            className="inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Find Your Nearest Branch
          </Link>
        </div>
      </div>
    </section>
  );
}
