"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rates", label: "Exchange Rates" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/branches", label: "Branches" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-primary/95 backdrop-blur-md shadow-lg shadow-primary-deep/30"
          : "bg-primary"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="L&S Forex Bureau home">
          <Image
            src="/logo.png"
            alt="L&S Forex Bureau"
            width={160}
            height={72}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+255743881309"
            className="text-sm font-semibold text-white/90 transition-colors hover:text-white"
          >
            0743 881 309
          </a>
          <Link
            href="/branches"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-primary-deep transition-transform hover:scale-[1.03] active:scale-100"
          >
            Find a Branch
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-primary px-4 pb-6 pt-2 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                    pathname === link.href
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/branches"
              className="rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-primary-deep"
            >
              Find a Branch
            </Link>
            <a
              href="tel:+255743881309"
              className="rounded-full border border-white/30 px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Call 0743 881 309
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
