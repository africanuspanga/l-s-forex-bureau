import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBranchBySlug,
  getBranches,
  PHONE_TEL,
} from "@/lib/rates";
import type { Branch } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  if (!branch) {
    return {
      title: "Branch Not Found | L&S Forex Bureau",
    };
  }

  return {
    title: `L&S Forex Bureau ${branch.area} Branch | Dar es Salaam`,
    description: `Visit L&S Forex Bureau in ${branch.area}, Dar es Salaam. Address, opening hours, directions and contact details.`,
  };
}

function mapEmbedUrl(branch: Branch): string {
  const query =
    branch.latitude !== null && branch.longitude !== null
      ? `${branch.latitude},${branch.longitude}`
      : `${branch.name}, Dar es Salaam`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
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

export default async function BranchDetailPage({ params }: Props) {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  if (!branch) {
    notFound();
  }

  const allBranches = await getBranches();
  const otherBranches = allBranches.filter(
    (other) => other.slug !== branch.slug
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: branch.name,
    telephone: PHONE_TEL,
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: "Dar es Salaam",
      addressCountry: "TZ",
    },
    ...(branch.latitude !== null && branch.longitude !== null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: branch.latitude,
            longitude: branch.longitude,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-hero-mesh pt-24">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="eyebrow eyebrow-accent animate-fade-up">L&amp;S Branch</p>
          <h1
            className="animate-fade-up font-display mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            {branch.name}
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-lg text-white/75"
            style={{ animationDelay: "160ms" }}
          >
            {branch.area} · {branch.address}
          </p>
        </div>
      </section>

      {/* Details + map */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8">
          {/* Info card */}
          <div className="card p-7 sm:p-9">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Visit This Branch
            </h2>

            <dl className="mt-7 flex flex-col gap-5">
              <div className="border-l-2 border-primary py-1 pl-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Address
                </dt>
                <dd className="mt-1 text-muted">{branch.address}</dd>
              </div>
              <div className="border-l-2 border-primary py-1 pl-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Opening Hours
                </dt>
                <dd className="mt-1 text-muted">{branch.openingHours}</dd>
              </div>
              <div className="border-l-2 border-primary py-1 pl-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${branch.phone}`}
                    className="font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {branch.phone}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <DirectionsIcon className="h-4 w-4" />
                Get Directions
              </a>
              <a href={`tel:${branch.phone}`} className="btn btn-outline">
                <PhoneIcon className="h-4 w-4" />
                Call {branch.phone}
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="card-shadow overflow-hidden rounded-2xl border border-surface-alt bg-white">
            <iframe
              src={mapEmbedUrl(branch)}
              title={`Map of ${branch.name}, ${branch.area}, Dar es Salaam`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] min-h-[380px] w-full border-0"
            />
          </div>
        </div>
      </section>

      {/* What to bring + rates teaser */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="card border-surface-alt bg-surface p-7 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">What to Bring</p>
                <p className="mt-3 text-muted">
                  Bring the currency you wish to exchange together with any
                  identification or supporting documents required for your
                  transaction.
                </p>
              </div>
              <Link href="/rates" className="btn btn-primary shrink-0">
                View today&apos;s rates before you visit
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other branches */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Our Other Branches
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherBranches.map((other) => (
              <Link
                key={other.id}
                href={`/branches/${other.slug}`}
                className="card group border-surface-alt p-6 transition-colors duration-300 hover:border-accent"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {other.area}
                </p>
                <h3 className="font-display mt-2 text-lg font-semibold text-foreground">
                  {other.name}
                </h3>
                <p className="mt-3 text-sm text-muted">{other.address}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  View branch
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
