"use client";

import { useState } from "react";
import Link from "next/link";
import type { Branch } from "@/lib/types";

function mapEmbedUrl(branch: Branch): string {
  const query =
    branch.latitude !== null && branch.longitude !== null
      ? `${branch.latitude},${branch.longitude}`
      : `${branch.name}, Dar es Salaam`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function DirectionsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 11 19-9-9 19-2-8-8-2Z" />
    </svg>
  );
}

export default function BranchesExplorer({ branches }: { branches: Branch[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    branches[0]?.slug ?? null
  );

  const selected =
    branches.find((branch) => branch.slug === selectedSlug) ?? branches[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      {/* Branch cards */}
      <div className="flex flex-col gap-5">
        {branches.map((branch) => {
          const isSelected = selected?.slug === branch.slug;
          return (
            <article
              key={branch.id}
              onClick={() => setSelectedSlug(branch.slug)}
              className={`cursor-pointer rounded-2xl bg-white p-6 transition-all duration-300 sm:p-7 ${
                isSelected
                  ? "card-shadow-lg border border-primary"
                  : "card-shadow border border-surface-alt hover:border-accent"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {branch.area}
                  </p>
                  <h3 className="font-display mt-1 text-xl font-semibold text-foreground">
                    {branch.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedSlug(branch.slug);
                  }}
                  className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-surface text-primary hover:bg-surface-alt"
                  }`}
                >
                  Show on map
                </button>
              </div>

              <dl className="mt-5 flex flex-col gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <dt className="sr-only">Address</dt>
                    <dd className="text-muted">{branch.address}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <dt className="sr-only">Opening hours</dt>
                    <dd className="text-muted">{branch.openingHours}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <dt className="sr-only">Phone</dt>
                    <dd>
                      <a
                        href={`tel:${branch.phone}`}
                        onClick={(event) => event.stopPropagation()}
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {branch.phone}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="btn btn-primary"
                >
                  <DirectionsIcon className="h-4 w-4" />
                  Get Directions
                </a>
                <Link
                  href={`/branches/${branch.slug}`}
                  onClick={(event) => event.stopPropagation()}
                  className="btn btn-outline"
                >
                  View branch
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Map */}
      <div className="lg:sticky lg:top-24">
        <div className="card-shadow overflow-hidden rounded-2xl border border-surface-alt bg-white">
          {selected && (
            <iframe
              key={selected.slug}
              src={mapEmbedUrl(selected)}
              title={`Map of ${selected.name}, ${selected.area}, Dar es Salaam`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] min-h-[420px] w-full border-0"
            />
          )}
        </div>
        {selected && (
          <p className="mt-4 text-center text-sm text-muted">
            Showing <span className="font-semibold text-foreground">{selected.area}</span>:{" "}
            <a
              href={selected.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              open in Google Maps
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
