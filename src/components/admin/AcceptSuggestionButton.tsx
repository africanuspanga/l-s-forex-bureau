"use client";

import { useState, useTransition } from "react";
import { acceptSuggestion } from "@/app/admin/actions";

export default function AcceptSuggestionButton({
  currencyCode,
  buyingRate,
  sellingRate,
  disabled,
}: {
  currencyCode: string;
  buyingRate: number;
  sellingRate: number;
  disabled: boolean;
}) {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await acceptSuggestion(currencyCode, buyingRate, sellingRate);
      if (result.ok) {
        setAccepted(true);
      } else {
        setError(result.error ?? "Failed to save draft.");
      }
    });
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || pending || accepted}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {accepted ? "Saved as draft" : pending ? "Saving…" : "Accept as draft"}
      </button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </span>
  );
}
