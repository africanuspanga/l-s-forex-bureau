import Link from "next/link";
import type { CurrencyRate } from "@/lib/rates";

export default function ServicesSection({ rates }: { rates: CurrencyRate[] }) {
  const major = rates.filter((r) => r.currency.category === "major");
  const regional = rates.filter((r) => r.currency.category === "regional");

  const groups = [
    { label: "International", items: major },
    { label: "Regional", items: regional },
  ].filter((g) => g.items.length > 0);

  return (
    <section className="bg-primary-deep py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow eyebrow-light">What we exchange</p>
            <h2 className="font-display mt-4 text-3xl leading-[1] sm:text-[2.6rem]">
              Buy or sell against shillings
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
              Travelling, coming home, paying a supplier or holding foreign cash —
              bring it to any branch and we&apos;ll exchange it for Tanzanian shillings,
              or the other way round.
            </p>
            <Link href="/services" className="btn btn-ghost-light mt-8">
              About our services
            </Link>
          </div>

          <div className="space-y-10 lg:col-span-7">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">{group.label}</p>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-4">
                  {group.items.map((r) => (
                    <li key={r.currency.code} title={r.currency.name} className="font-display text-3xl sm:text-4xl">
                      {r.currency.code}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="border-t border-white/15 pt-6">
              <p className="font-bold">Changing a large amount?</p>
              <p className="mt-1 max-w-lg text-white/70">
                Call your branch first so we can confirm the rate and make sure the
                notes are ready when you arrive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
