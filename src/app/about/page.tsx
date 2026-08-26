import type { Metadata } from "next";
import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/rates";

export const metadata: Metadata = {
  title: "About L&S Forex Bureau",
  description:
    "L&S Forex Bureau provides professional foreign currency exchange services to customers across Dar es Salaam.",
};

const APPROACH = [
  {
    title: "Transparency",
    copy: "Clearly communicated buying and selling rates.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
      />
    ),
    extraIcon: <circle cx="12" cy="12" r="2.75" />,
  },
  {
    title: "Convenience",
    copy: "Multiple branches across Dar es Salaam.",
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
    title: "Professionalism",
    copy: "Reliable service and proper transaction documentation.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
    extraIcon: null,
  },
  {
    title: "Customer Service",
    copy: "A knowledgeable team available to help customers understand the exchange process.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z"
      />
    ),
    extraIcon: null,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero band */}
      <section className="bg-hero-mesh pt-34">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            About L&S
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A Trusted Name in Foreign Exchange
          </h1>
        </div>
      </section>

      {/* About copy */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-muted">
            L&S Forex Bureau provides professional foreign currency exchange
            services to customers across Dar es Salaam. With convenient
            locations in Tegeta, Mbezi Beach, Mikocheni and Masaki, our focus
            is simple: make exchanging currency straightforward, transparent
            and convenient. Whether you are travelling, conducting business,
            receiving foreign currency or preparing for an international trip,
            our team is ready to assist you with current rates and
            professional branch service.
          </p>
        </div>
      </section>

      {/* Our approach */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            How We Work
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Approach
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((item) => (
              <div key={item.title} className="border-l-2 border-primary pl-5">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.copy}
                </p>
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
