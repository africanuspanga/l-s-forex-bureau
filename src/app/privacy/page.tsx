import type { Metadata } from "next";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/rates";

export const metadata: Metadata = {
  title: "Privacy Policy | L&S Forex Bureau",
  description:
    "How L&S Forex Bureau handles the information you share with us through this website.",
};

const SECTIONS = [
  {
    title: "What We Collect",
    copy: "When you use the contact form on this website, we collect your name, phone number, message and, if you choose to provide it, your email address and preferred branch.",
  },
  {
    title: "How We Use Your Information",
    copy: "The information you submit is used only to respond to your enquiry, for example to answer a question about exchange rates, currency availability or branch locations. We do not use it for any other purpose.",
  },
  {
    title: "No Online Transactions",
    copy: "This website does not process currency exchange transactions. All exchanges take place in person at L&S Forex Bureau branches, so no payment or transaction details are collected online.",
  },
  {
    title: "Data Sharing",
    copy: "We do not sell, rent or trade your personal information to third parties. Your details are only accessible to the L&S team members handling your enquiry.",
  },
  {
    title: "Questions",
    copy: "If you have any questions about this privacy policy or how your information is handled, please call us on the number below.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Hero band */}
      <section className="bg-hero-mesh pt-24">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Privacy Policy
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Policy sections */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                  {section.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted">{section.copy}</p>
              </div>
            ))}
          </div>
          <p className="mt-10">
            <a
              href={`tel:${PHONE_TEL}`}
              className="tabular font-display text-2xl font-bold text-primary transition-colors hover:text-primary-dark"
            >
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
