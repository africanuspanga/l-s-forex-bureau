const FAQS = [
  {
    question: "Are the rates shown online final?",
    answer:
      "Rates shown on the website are indicative and may change as market conditions change. Please contact or visit an L&S branch for the final applicable rate.",
  },
  {
    question: "Can I exchange currency online?",
    answer:
      "No. L&S foreign exchange transactions are completed through our physical branches.",
  },
  {
    question: "Where can I find L&S?",
    answer:
      "L&S operates branches in Tegeta, Mbezi Beach, Mikocheni and Masaki in Dar es Salaam.",
  },
  {
    question: "Which currencies do you exchange?",
    answer:
      "L&S handles a range of major international and regional currencies. Current supported currencies and rates are displayed on the Exchange Rates page.",
  },
  {
    question: "Can I call before visiting?",
    answer:
      "Yes. Call 0743 881 309 to confirm the current rate or currency availability.",
  },
  {
    question: "Do rates change during the day?",
    answer:
      "Foreign exchange markets can move throughout the day. The rate applicable to your transaction will be confirmed at the branch.",
  },
  {
    question: "Will I receive a receipt?",
    answer:
      "Customers should receive the appropriate transaction receipt after completing their exchange.",
  },
];

export default function Faq() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="eyebrow">Questions</p>
          <h2 className="font-display mt-4 text-3xl leading-[1] text-foreground sm:text-[2.6rem]">
            Before you visit
          </h2>
        </div>

        <div className="lg:col-span-7">
          {FAQS.map((faq, i) => (
            <details key={faq.question} open={i === 0} className="group border-t border-primary/12 last:border-b">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold text-foreground [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="font-mono text-xl font-normal text-primary transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="-mt-1 max-w-2xl pb-6 leading-relaxed text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
