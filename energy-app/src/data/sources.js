// sources.js - the nine energy sources (in stacking order, bottom to top),
// their colours and groups, plus helpers to look up the data.
// Fossil fuels are warm greys and browns; low-carbon sources are cool
// blues, purples and greens, so the two groups read apart at a glance.
import { data } from "./energy.js";

export const SOURCES = [
  { key: "coal", label: "Coal", color: "#4a5568", group: "fossil" },
  { key: "oil", label: "Oil", color: "#9c6b30", group: "fossil" },
  { key: "gas", label: "Gas", color: "#e0a458", group: "fossil" },
  { key: "nuclear", label: "Nuclear", color: "#8e5cc9", group: "low" },
  { key: "hydro", label: "Hydro", color: "#1d6fd8", group: "low" },
  { key: "wind", label: "Wind", color: "#1a9e8f", group: "low" },
  { key: "solar", label: "Solar", color: "#f2c12e", group: "low" },
  { key: "biofuel", label: "Biofuels", color: "#6aa84f", group: "low" },
  { key: "other_renewable", label: "Other renewables", color: "#9bd3c9", group: "low" },
];

export const GROUPS = {
  fossil: { label: "Fossil fuels", color: "#7a5a3a" },
  low: { label: "Low-carbon", color: "#17804f" },
};

export const FIRST_YEAR = 1965;
export const LAST_YEAR = 2024;

// Rows that have a breakdown by source (Nigeria has only a total)
const hasMix = (d) => d.coal !== null;

// Countries with a breakdown, World first, then A-Z
export const COUNTRIES = [
  "World",
  ...[...new Set(data.filter(hasMix).map((d) => d.country))]
    .filter((c) => c !== "World")
    .sort(),
];

// All rows for one country, oldest first, only years with a breakdown
const byCountry = new Map();
for (const d of data) {
  if (!hasMix(d)) continue;
  if (!byCountry.has(d.country)) byCountry.set(d.country, []);
  byCountry.get(d.country).push(d);
}
export const seriesFor = (country) => byCountry.get(country) ?? [];

// One row, or undefined if that country has no data for that year
export const rowFor = (country, year) =>
  seriesFor(country).find((d) => d.year === year);

// Share of primary energy, 0-1
export const share = (row, key) => row[key] / row.primary_energy;
export const groupShare = (row, group) =>
  SOURCES.filter((s) => s.group === group).reduce((t, s) => t + row[s.key], 0) /
  row.primary_energy;

// Every country (not World, not Nigeria) for one year
export const countriesIn = (year) =>
  data.filter((d) => d.year === year && d.country !== "World" && hasMix(d));

// Number formats
export const twh = (v) =>
  v >= 10000 ? `${Math.round(v / 1000).toLocaleString("en-US")}k` : Math.round(v).toLocaleString("en-US");
export const pct = (v, digits = 0) => `${(v * 100).toFixed(digits)}%`;
