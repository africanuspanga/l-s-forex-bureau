import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import BulkManager from "@/components/admin/BulkManager";

export const metadata: Metadata = {
  title: "Bulk Rate Update | L&S Forex Bureau",
};

export default async function AdminBulkPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Bulk Rate Update
        </h1>
        <p className="mt-1 text-sm text-muted">
          Paste one rate per line as{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs">
            CODE | buy | sell
          </code>{" "}
          (commas, tabs or wide spaces also work). Preview first — rows with
          errors are never saved or published.
        </p>
      </div>
      <BulkManager />
    </div>
  );
}
