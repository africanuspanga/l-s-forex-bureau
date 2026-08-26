import Link from "next/link";
import Image from "next/image";

const ITEMS = [
  {
    title: "Transparent Rates",
    copy: "Clearly displayed buying and selling rates so customers can understand the exchange before completing their transaction.",
  },
  {
    title: "Convenient Locations",
    copy: "Four branches strategically located across Dar es Salaam.",
  },
  {
    title: "Professional Service",
    copy: "A straightforward branch experience designed to make currency exchange easy.",
  },
  {
    title: "Trusted & Regulated",
    copy: "L&S Forex Bureau operates within Tanzania's regulated foreign exchange sector.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary-deep">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/photos/harbor-dusk.jpg"
              alt=""
              fill
              aria-hidden="true"
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="relative bg-primary-deep/70 px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
              <div>
                <p className="eyebrow eyebrow-accent">Why L&amp;S</p>
                <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Foreign Exchange Without the Complexity
                </h2>
                <Link href="/branches" className="btn btn-accent mt-8">
                  Visit L&amp;S Today
                </Link>
              </div>

              <ul className="grid gap-8 sm:grid-cols-2">
                {ITEMS.map((item, i) => (
                  <li key={item.title} className="animate-fade-up border-l-2 border-accent pl-4" style={{ animationDelay: `${i * 90}ms` }}>
                    <h3 className="font-display text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{item.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
