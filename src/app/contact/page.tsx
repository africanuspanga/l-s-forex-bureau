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
      <section className="bg-hero-mesh pt-34">
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
          <div className="card p-7 sm:p-9 lg:col-span-2">
            <p className="eyebrow">Call Our Team</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
              Speak to L&amp;S Directly
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
              <a href={`tel:${PHONE_TEL}`} className="btn btn-primary">
                Call L&amp;S
              </a>
              <Link href="/branches" className="btn btn-outline">
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
