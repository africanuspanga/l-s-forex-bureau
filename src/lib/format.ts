// Client-safe formatting helpers and shared constants.
// (No server-only imports — usable from both server and client components.)

export const PHONE_DISPLAY = "0743 881 309";
export const PHONE_TEL = "+255743881309";

export function formatTzs(value: number): string {
  const decimals = value < 10 ? 2 : 0;
  return `TZS ${value.toLocaleString("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatRateNumber(value: number): string {
  const decimals = value < 10 ? 2 : 0;
  return value.toLocaleString("en-TZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Dar_es_Salaam",
  });
}

export function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
