import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/rates";

export default function ConversionCta() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="my-4 rounded-2xl bg-brand-gradient px-6 py-16 text-center card-shadow-lg sm:px-10 lg:py-20">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Need Foreign Currency Today?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Check the latest L&amp;S rates and visit the branch closest to you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/rates" className="btn btn-white">
              Check Exchange Rates
            </Link>
            <a href={`tel:${PHONE_TEL}`} className="btn btn-ghost-light">
              Call {PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Our team can confirm current rates and currency availability before you visit.
          </p>
        </div>
      </div>
    </section>
  );
}
