import Link from "next/link";
import type { Branch } from "@/lib/types";

function coord(value: number | null, pos: string, neg: string): string | null {
  if (value === null) return null;
  return `${Math.abs(value).toFixed(3)}°${value < 0 ? neg : pos}`;
}

/** The four branches as stops on one line, north to south along the coast. */
export default function BranchLine({ branches }: { branches: Branch[] }) {
  return (
    <section className="bg-white pb-20 pt-24 lg:pb-28 lg:pt-44">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="eyebrow">Branches</p>
          <h2 className="font-display mt-4 text-3xl leading-[1] text-foreground sm:text-[2.6rem]">
            Tegeta to Masaki
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            From the north end of the city down to the Msasani peninsula. Same rates
            at every counter, so pick whichever is on your way.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 w-[3px] bg-primary sm:hidden lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[7px] lg:block lg:h-[3px] lg:w-auto"
          />
          {branches.map((branch) => {
            const lat = coord(branch.latitude, "N", "S");
            const lng = coord(branch.longitude, "E", "W");
            return (
              <li key={branch.id} className="relative pl-10 sm:pl-0 lg:pr-8">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-[17px] w-[17px] rounded-full border-[3px] border-primary bg-white sm:relative sm:block"
                />
                <Link href={`/branches/${branch.slug}`} className="group block sm:mt-6">
                  <h3 className="font-display text-xl leading-tight text-foreground group-hover:text-primary sm:text-2xl">
                    {branch.area}
                  </h3>
                  {lat && lng && (
                    <p className="tabular mt-2 font-mono text-[11px] text-muted">
                      {lat} {lng}
                    </p>
                  )}
                  <p className="mt-4 text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4">
                    Directions &amp; details
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
