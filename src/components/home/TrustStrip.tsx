const ITEMS = [
  {
    title: "Licensed Forex Bureau",
    copy: "Professional foreign exchange services in Dar es Salaam.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 12l1.8 1.8L15 10" />
      </svg>
    ),
  },
  {
    title: "Competitive Rates",
    copy: "Buying and selling rates updated regularly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17l5-5 3.5 3.5L20 8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8h5v5" />
      </svg>
    ),
  },
  {
    title: "Four Convenient Locations",
    copy: "Tegeta, Mbezi Beach, Mikocheni and Masaki.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.1 7-11a7 7 0 10-14 0c0 5.9 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Fast Service",
    copy: "Simple, straightforward branch-based transactions.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L5 13h5l-1 8 8-10h-5l1-8z" />
      </svg>
    ),
  },
];

export default function TrustStrip() {
  return (
    <section className="relative z-10 -mt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-3xl bg-white p-6 card-shadow sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <div key={item.title} className="animate-fade-up flex gap-4" style={{ animationDelay: `${i * 90}ms` }}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {item.icon}
              </span>
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
