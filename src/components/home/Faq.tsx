"use client";

import { useState } from "react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Common Questions</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.question} className="card">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-sm font-bold text-foreground sm:text-base">
                    {faq.question}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className={`h-5 w-5 shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {open && (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
