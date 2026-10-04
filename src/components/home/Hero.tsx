import Link from "next/link";
import type { CurrencyRate } from "@/lib/rates";
import ExchangeCalculator from "@/components/ExchangeCalculator";

interface HeroProps {
  rates: CurrencyRate[];
}

export default function Hero({ rates }: HeroProps) {
  return (
    <section className="relative bg-primary pt-34 text-white">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-0 lg:pt-20">
        <div className="lg:col-span-7 lg:pb-24">
          <p className="eyebrow eyebrow-light">Tegeta · Mbezi Beach · Mikocheni · Masaki</p>
          <h1 className="font-display mt-6 text-[2.6rem] leading-[0.95] sm:text-6xl lg:text-[4.6rem]">
            Four branches.
            <br />
            <span className="text-accent">One set of rates.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/80">
            Every L&amp;S branch in Dar es Salaam works from the same buying and
            selling rates, published here each morning. Work out your amount, then
            go to whichever branch is closest.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/rates" className="btn btn-accent">
              Today&apos;s rates
            </Link>
            <Link href="/branches" className="btn btn-ghost-light">
              Find a branch
            </Link>
          </div>
        </div>

        {/* The slip hangs off the bottom of the blue band on large screens. */}
        <div className="relative z-10 mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none lg:translate-y-28 lg:self-end lg:pl-10">
          <div className="lg:-rotate-[1.5deg]">
            <ExchangeCalculator rates={rates} />
          </div>
        </div>
      </div>
    </section>
  );
}
