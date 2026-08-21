import type { Metadata } from "next";
import Link from "next/link";
import { getBranches, PHONE_DISPLAY, PHONE_TEL } from "@/lib/rates";
import ContactForm from "@/components/contact/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact L&S Forex Bureau",
  description:
    "Contact the L&S Forex Bureau team or visit one of our branches in Dar es Salaam.",
};

export default async function ContactPage() {
  const branches = await getBranches();
  const branchOptions = branches.map((b) => ({ area: b.area }));

  return (
    <>
      {/* Hero band */}
      <section className="bg-hero-mesh pt-16">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Contact L&S
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How Can We Help?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Have a question about today&apos;s exchange rate, a particular
            currency or the nearest L&S location? Contact our team or visit
            one of our branches.
          </p>
        </div>
      </section>

      {/* Contact card + form */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="rounded-2xl bg-white p-7 card-shadow sm:p-9 lg:col-span-2">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-alt text-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5.25C3 4 4 3 5.25 3h2.25c.62 0 1.16.42 1.31 1.02l1.05 3.93c.13.5-.06 1.03-.48 1.33l-1.6 1.26a12.6 12.6 0 0 0 5.68 5.68l1.26-1.6c.3-.42.83-.61 1.33-.48l3.93 1.05c.6.15 1.02.69 1.02 1.31v2.25C21 20 20 21 18.75 21h-.75C9.72 21 3 14.28 3 6v-.75Z"
                />
              </svg>
            </span>
            <h2 className="mt-5 font-display text-xl font-semibold text-foreground">
              Call Our Team
            </h2>
            <a
              href={`tel:${PHONE_TEL}`}
              className="tabular mt-3 block font-display text-3xl font-bold tracking-tight text-primary transition-colors hover:text-primary-dark"
            >
              {PHONE_DISPLAY}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Speak with our team about current rates, currency availability
              or branch directions.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <a
                href={`tel:${PHONE_TEL}`}
                className="rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-100"
              >
                Call L&S
              </a>
              <Link
                href="/branches"
                className="rounded-full border border-primary/25 px-6 py-3 text-center text-sm font-semibold text-primary transition-colors hover:bg-surface-alt"
              >
                Find a Branch
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm branches={branchOptions} />
          </div>
        </div>
      </section>
    </>
  );
}
