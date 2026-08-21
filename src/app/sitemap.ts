import type { MetadataRoute } from "next";

const BASE_URL = "https://www.lsforexbureau.co.tz";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE_URL}/`, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/rates`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/branches`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/branches/tegeta`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/branches/mbezi-beach`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/branches/mikocheni`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/branches/masaki`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
