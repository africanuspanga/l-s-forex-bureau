export type RateStatus = "draft" | "published" | "archived";

export type RateSource = "manual" | "bot_suggestion" | "bulk_import" | "seed";

export interface Currency {
  code: string;
  name: string;
  country: string;
  flag: string; // emoji flag
  symbol: string;
  category: "major" | "regional";
  displayOrder: number;
  active: boolean;
  featured: boolean; // shown on homepage
}

export interface Rate {
  currencyCode: string;
  buyingRate: number; // TZS L&S pays when buying foreign currency
  sellingRate: number; // TZS customer pays when buying foreign currency
  effectiveAt: string; // ISO timestamp
  status: RateStatus;
  source: RateSource;
  createdBy: string;
  createdAt: string;
}

export interface RateHistoryEntry {
  id: string;
  currencyCode: string;
  previousBuyingRate: number | null;
  newBuyingRate: number;
  previousSellingRate: number | null;
  newSellingRate: number;
  user: string;
  source: RateSource;
  timestamp: string;
}

export interface BotReferenceRate {
  id: string;
  currencyCode: string;
  buyingRate: number;
  sellingRate: number;
  meanRate: number;
  transactionDate: string; // YYYY-MM-DD from BoT
  fetchedAt: string;
  rawSource: string; // url
  validationStatus: "valid" | "failed";
  validationErrors?: string[];
}

export interface MarginRule {
  currencyCode: string;
  buyMarginPercent: number;
  sellMarginPercent: number;
  buyFixedAdjustment: number;
  sellFixedAdjustment: number;
  roundingIncrement: number;
  autoPublishEnabled: boolean;
}

export interface SuggestedRate {
  currencyCode: string;
  suggestedBuyingRate: number;
  suggestedSellingRate: number;
  botMeanRate: number;
  botTransactionDate: string;
  currentBuyingRate: number | null;
  currentSellingRate: number | null;
  validations: { rule: string; passed: boolean; detail?: string }[];
  ok: boolean;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  area: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  openingHours: string;
  mapUrl: string;
  active: boolean;
}

export interface DatabaseShape {
  currencies: Currency[];
  rates: Rate[];
  rateHistory: RateHistoryEntry[];
  botReferenceRates: BotReferenceRate[];
  marginRules: MarginRule[];
  branches: Branch[];
  meta: {
    lastBotSyncAt: string | null;
    lastBotSyncStatus: "ok" | "failed" | null;
    lastBotSyncMessage: string | null;
    lastPublishedAt: string | null;
  };
}

export interface ContactMessage {
  fullName: string;
  phone: string;
  email?: string;
  preferredBranch?: string;
  subject: string;
  message: string;
}
