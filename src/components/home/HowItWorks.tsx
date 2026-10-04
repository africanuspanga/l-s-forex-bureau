const STEPS = [
  {
    title: "Check today's rate",
    copy: "Look up the buying and selling rate here, or call any branch.",
  },
  {
    title: "Go to your nearest branch",
    copy: "Tegeta, Mbezi Beach, Mikocheni or Masaki — the rates are the same at all four.",
  },
  {
    title: "Bring your currency and ID",
    copy: "Bring the currency you want to exchange, plus any identification or documents your transaction needs.",
  },
  {
    title: "Exchange and take your receipt",
    copy: "We complete the exchange at the confirmed rate and hand you a transaction receipt.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="eyebrow">At the branch</p>
          <h2 className="font-display mt-4 text-3xl leading-[1] text-foreground sm:text-[2.6rem]">
            How an exchange works
          </h2>
        </div>

        <ol className="lg:col-span-7">
          {STEPS.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-primary/12 py-6 last:border-b">
              <span className="tabular font-mono text-sm font-semibold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
