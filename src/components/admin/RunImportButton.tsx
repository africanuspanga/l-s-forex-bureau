"use client";

import { useState, useTransition } from "react";
import { runImport, type RunImportResult } from "@/app/admin/actions";

export default function RunImportButton() {
  const [result, setResult] = useState<RunImportResult | null>(null);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      setResult(await runImport());
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Importing…" : "Run BoT import now"}
      </button>
      {result && (
        <p
          role="status"
          className={`rounded-lg border px-3.5 py-2 text-sm ${
            result.ok
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {result.message ??
            (result.ok
              ? `Imported ${result.importedCount ?? 0} rate(s)${
                  result.transactionDate
                    ? ` for ${result.transactionDate}`
                    : ""
                }.`
              : (result.error ?? "Import failed."))}
        </p>
      )}
    </div>
  );
}
