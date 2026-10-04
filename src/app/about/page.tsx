import type { Metadata } from "next";
import Image from "next/image";
import CallBand from "@/components/CallBand";

export const metadata: Metadata = {
  title: "About L&S Forex Bureau",
  description:
    "L&S Forex Bureau provides professional foreign currency exchange services to customers across Dar es Salaam.",
};

const PRINCIPLES = [
  ["Rates in the open", "Buying and selling rates are published here and at the counter before you commit."],
  ["Four places to go", "Tegeta, Mbezi Beach, Mikocheni and Masaki, all working from the same rates."],
  ["Paperwork done properly", "Every exchange is documented and you leave with a transaction receipt."],
  ["People who explain", "Ask at the counter and our team will walk you through the exchange."],
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-primary pt-34 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="eyebrow eyebrow-light">About L&amp;S</p>
          <h1 className="font-display mt-5 max-w-4xl text-4xl leading-[0.98] sm:text-6xl">
            Currency exchange across Dar es Salaam
          </h1>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <div className="lg:col-span-7">
            <p className="text-2xl leading-snug text-foreground">
              L&amp;S Forex Bureau exchanges foreign currency for people and businesses
              from four branches across Dar es Salaam.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Whether you are travelling, coming home, paying for business or
              receiving money from abroad, the job is the same: give you a clear rate,
              exchange your money properly, and get you on your way. That&apos;s why
              every branch works from one set of published rates.
            </p>

            <dl className="mt-12">
              {PRINCIPLES.map(([title, copy]) => (
                <div key={title} className="grid gap-1 border-t border-primary/12 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8">
                  <dt className="font-bold text-foreground">{title}</dt>
                  <dd className="leading-relaxed text-muted">{copy}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src="/photos/harbor-dusk.jpg"
                alt="Dar es Salaam harbour at dusk"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <CallBand />
    </>
  );
}
