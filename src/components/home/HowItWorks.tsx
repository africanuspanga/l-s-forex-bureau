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
          <p className="eyebrow">Simple &amp; Straightforward</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Exchange Currency in Four Simple Steps
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <div key={step.number} className="animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-bold text-gradient">{step.number}</span>
                <div className="h-px flex-1 bg-primary/10" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/branches" className="btn btn-primary">
            Find Your Nearest Branch
          </Link>
        </div>
      </div>
    </section>
  );
}
