import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/rates", label: "Exchange Rates" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/branches", label: "Branches" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-deep text-white">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 lg:px-8 lg:pb-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Image
              src="/logo.png"
              alt="L&S Forex Bureau"
              width={175}
              height={60}
              className="h-14 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              Professional foreign currency exchange services across Dar es
              Salaam.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Explore
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Visit Us
            </h3>
            <p className="mt-4 text-sm text-white/75">
              Tegeta • Mbezi Beach • Mikocheni • Masaki
            </p>
            <a
              href="tel:+255743881309"
              className="mt-3 inline-block text-lg font-semibold text-white transition-colors hover:text-accent"
            >
              0743 881 309
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-white/50">
            Exchange rates displayed online are indicative and subject to
            change. Final transaction rates are confirmed at an L&S Forex
            Bureau branch.
          </p>
          <p className="mt-3 text-xs text-white/50">
            © {new Date().getFullYear()} L&S Forex Bureau. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
