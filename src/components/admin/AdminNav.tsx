"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/rates", label: "Manage Rates", exact: false },
  { href: "/admin/bulk", label: "Bulk Update", exact: false },
  { href: "/admin/suggestions", label: "Suggestions", exact: false },
  { href: "/admin/history", label: "History", exact: false },
  { href: "/admin/margins", label: "Margin Rules", exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-1.5">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
