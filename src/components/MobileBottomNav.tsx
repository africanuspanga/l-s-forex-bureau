"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  home: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"
    />
  ),
  rates: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 19V9m5 10V5m5 14v-7m5 7V3"
    />
  ),
  branches: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11z"
      />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  contact: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5.5A1.5 1.5 0 0 1 5.5 4h2.6a1 1 0 0 1 .95.68l1.2 3.5a1 1 0 0 1-.27 1.05l-1.6 1.5a12.5 12.5 0 0 0 5.9 5.9l1.5-1.6a1 1 0 0 1 1.05-.27l3.5 1.2a1 1 0 0 1 .68.95v2.6a1.5 1.5 0 0 1-1.5 1.5H19C10.72 21 4 14.28 4 6z"
    />
  ),
} as const;

interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

interface MobileBottomNavProps {
  items: NavItem[];
  /** Tailwind classes for the active pill background + text, e.g. "bg-primary/10 text-primary" */
  activeClasses?: string;
}

export default function MobileBottomNav({
  items,
  activeClasses = "text-primary",
}: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/15 bg-white lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${
                  active ? activeClasses : "text-muted"
                }`}
              >
                {active && <span className="absolute inset-x-4 top-0 h-[3px] bg-current" aria-hidden="true" />}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  {ICONS[item.icon]}
                </svg>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
