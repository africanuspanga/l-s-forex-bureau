const ITEMS = [
  { title: "Licensed Forex Bureau", copy: "Professional foreign exchange services in Dar es Salaam." },
  { title: "Competitive Rates", copy: "Buying and selling rates updated regularly." },
  { title: "Four Convenient Locations", copy: "Tegeta, Mbezi Beach, Mikocheni and Masaki." },
  { title: "Fast Service", copy: "Simple, straightforward branch-based transactions." },
];

export default function TrustStrip() {
  return (
    <section className="relative z-10 -mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="card grid gap-x-8 gap-y-7 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="animate-fade-up border-l-2 border-accent pl-4"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
