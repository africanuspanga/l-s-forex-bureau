import Link from "next/link";
import Image from "next/image";

const FACTS = [
  "4 branches across Dar es Salaam",
  "Transparent, published rates",
  "Licensed & regulated",
];

export default function WhyChoose() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary-deep">
          <div className="absolute inset-0 opacity-25">
            <Image
              src="/photos/harbor-dusk.jpg"
              alt=""
              fill
              aria-hidden="true"
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="relative bg-primary-deep/60 px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="eyebrow eyebrow-accent">Why L&amp;S</p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Foreign exchange without the complexity.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                Four branches across Dar es Salaam — Tegeta, Mbezi Beach,
                Mikocheni and Masaki — each publishing the same transparent
                buying and selling rates. L&amp;S operates within
                Tanzania&apos;s regulated foreign exchange sector, so every
                transaction is documented and every rate is clear before you
                commit.
              </p>

              <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/12 pt-6 text-sm font-medium text-white">
                {FACTS.map((fact, i) => (
                  <li key={fact} className="flex items-center gap-5">
                    {i > 0 && <span className="h-4 w-px bg-white/20" aria-hidden="true" />}
                    {fact}
                  </li>
                ))}
              </ul>

              <Link href="/branches" className="btn btn-accent mt-8">
                Visit L&amp;S Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
