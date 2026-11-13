// terminations.js - the data behind the donut.
//
// Main data: snapshot.json, built by scripts/fetch-terminations.mjs from the
// ClinicalTrials.gov API: every trial marked TERMINATED with a completion
// date in the window, its "why stopped" text sorted into one category by the
// keyword rules in scripts/classify.mjs.
//
// Background (mentioned in the footer): Williams RJ, Tse T, DiPiazza K,
// Zarin DA. PLOS ONE 2015;10(5):e0127242, which hand-sorted 905 earlier
// terminated trials into the same categories (except COVID-19).
import snapshot from "./snapshot.json";

export { snapshot };

export const SOURCES = {
  api: {
    label: "ClinicalTrials.gov API",
    url: "https://clinicaltrials.gov/data-api/api",
  },
  rules: {
    label: "classify.mjs",
    url: "https://github.com/sthakrar/homepage/blob/main/trials-app/scripts/classify.mjs",
  },
  study2015: {
    label: "Williams et al., PLOS ONE 2015",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4444136/",
  },
};

// What each category covers, shown when a legend row is hovered
const DETAIL = {
  accrual: "Too few participants enrolled, slow recruitment, not feasible to enroll",
  business: "Sponsor or company decision, strategy, portfolio, development stopped",
  covid: "Stopped because of the COVID-19 pandemic (including pandemic-related enrollment problems)",
  conduct: "Investigator left, site or staff issues, protocol or administrative problems",
  funding: "Funding ended, withdrawn or not obtained",
  supply: "Study drug or device unavailable, manufacturing problems",
  external: "Results of other trials, competing trials, change in standard of care",
  withdrawn: "Product recalled or withdrawn from the market",
  other: "A reason was given but doesn't fit the categories above",
  data: "The trial's own results: lack of efficacy, futility, safety or adverse events",
  none: "No reason given",
};

// Colours: a distinct hue for each sizeable reason, so slices are easy to
// tell apart; the small ones and "Other" in soft greys. The trial's own data
// is red (benefit or harm), and "no reason" a slate grey.
const COLORS = {
  accrual: "#1d6fd8",    // blue
  business: "#e07b39",   // orange
  covid: "#8e5cc9",      // purple
  conduct: "#1a9e8f",    // teal
  funding: "#e0b13a",    // amber
  supply: "#c46aa0",     // pink
  external: "#6aa84f",   // green
  withdrawn: "#9fb3c8",  // grey-blue
  other: "#cfd6df",      // light grey
  data: "#d64545",       // red
  none: "#7d8a9c",       // slate
};

// Order: the non-data reasons by size (with "Other" last), then data-driven,
// then no reason, so related slices sit together around the donut
const notData = snapshot.rows
  .filter((r) => r.group === "Not about the trial's data" && r.key !== "other")
  .sort((a, b) => b.count - a.count);
const ordered = [
  ...notData,
  snapshot.rows.find((r) => r.key === "other"),
  snapshot.rows.find((r) => r.key === "data"),
  snapshot.rows.find((r) => r.key === "none"),
];

export const data = ordered.map((r) => ({
  ...r,
  detail: DETAIL[r.key],
  color: COLORS[r.key],
}));
