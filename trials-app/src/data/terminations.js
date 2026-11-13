// terminations.js - the data behind the donut.
//
// Main data: snapshot.json, built by scripts/fetch-terminations.mjs from the
// ClinicalTrials.gov API: every trial marked TERMINATED with a completion
// date in the window, its "why stopped" text sorted into one category by the
// keyword rules in scripts/classify.mjs.
//
// Comparison: Williams RJ, Tse T, DiPiazza K, Zarin DA. PLOS ONE
// 2015;10(5):e0127242, Table 1 (905 terminated trials with results, to 2013).
// Those categories were assigned by hand; COVID-19 did not exist then.
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

// The 2015 study's counts per category (Table 1), out of 905
const STUDY_2015 = {
  accrual: 350, business: 77, conduct: 58, external: 51, funding: 34,
  withdrawn: 18, supply: 17, other: 14, data: 193, none: 93,
};
export const TOTAL_2015 = 905;

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

// Colours: blues for "not about the trial's data" (darkest = biggest),
// dark ink for the trial's own data, grey for no reason given
const BLUES = ["#1d6fd8", "#3f84df", "#5c97e5", "#78a9ea", "#93bbef", "#abcaf2", "#c0d8f5", "#d2e3f8", "#e2edfb"];

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

export const data = ordered.map((r, i) => ({
  ...r,
  detail: DETAIL[r.key],
  color: r.key === "data" ? "#0f2a44" : r.key === "none" ? "#a9b6c6" : BLUES[i],
  // Share in the 2015 study (null for COVID-19, which had no 2015 category)
  share2015: STUDY_2015[r.key] === undefined ? null : STUDY_2015[r.key] / TOTAL_2015,
}));
