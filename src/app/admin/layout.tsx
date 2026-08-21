import Image from "next/image";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { logout } from "./actions";

/**
 * Purely visual shell for the admin area. Auth guards live in each admin
 * page (login excepted) so this layout can wrap the login page too.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar (horizontal scroll nav on mobile) */}
        <aside className="bg-primary-deep text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
          <div className="flex items-center gap-3 px-5 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Image
                src="/logo.png"
                alt="L&S Forex Bureau"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold">L&S Forex Bureau</p>
              <p className="text-xs text-white/60">Admin</p>
            </div>
          </div>
          <div className="px-3 pb-4 lg:flex-1 lg:px-4">
            <AdminNav />
          </div>
          <div className="hidden px-4 pb-6 lg:block">
            <form action={logout}>
              <button
                type="submit"
                className="w-full rounded-lg border border-white/20 px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-foreground/10 bg-white px-6 py-3.5 lg:px-8">
            <p className="font-display text-sm font-semibold text-foreground">
              Admin Console
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="rounded-lg border border-foreground/15 px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                View website
              </Link>
              <form action={logout} className="lg:hidden">
                <button
                  type="submit"
                  className="rounded-lg border border-foreground/15 px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Log out
                </button>
              </form>
            </div>
          </header>
          <div className="flex-1 p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
