import Link from "next/link";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/format";

/** Closing strip used across pages: the phone number, big, and where to go. */
export default function CallBand() {
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-16">
        <div>
          <p className="eyebrow eyebrow-light">Call before you come</p>
          <a
            href={`tel:${PHONE_TEL}`}
            className="tabular mt-4 block font-mono text-4xl font-semibold tracking-tight hover:text-accent sm:text-6xl"
          >
            {PHONE_DISPLAY}
          </a>
          <p className="mt-4 max-w-md text-white/75">
            We&apos;ll confirm today&apos;s rate and whether your branch has the currency you need.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/rates" className="btn btn-accent">
            Today&apos;s rates
          </Link>
          <Link href="/branches" className="btn btn-ghost-light">
            All branches
          </Link>
        </div>
      </div>
    </section>
  );
}
