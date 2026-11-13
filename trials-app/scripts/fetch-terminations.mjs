// fetch-terminations.mjs - builds src/data/snapshot.json from ClinicalTrials.gov.
//
// Run with:  node scripts/fetch-terminations.mjs
//
// 1. Downloads every study with status TERMINATED whose completion date falls
//    in the window below, from the ClinicalTrials.gov API (v2).
// 2. Sorts each sponsor's "why stopped" text into one category with keyword
//    rules (classify.mjs; checked in order: the first match wins), and
//    splits the "Other" category into themes (classifyOther).
// 3. Writes the counts, the query and today's date to src/data/snapshot.json.
//    With --samples it also prints a few examples per category for checking.
import { writeFileSync } from "node:fs";

const FROM = "2020-01-01";
const TO = "2025-12-31";
const API = "https://clinicaltrials.gov/api/v2/studies";

import { CATEGORIES, OTHER, NONE, classify, classifyOther, OTHER_SUBGROUPS, OTHER_VAGUE, OTHER_REST } from "./classify.mjs";

async function fetchAll() {
  const studies = [];
  let pageToken;
  do {
    const params = new URLSearchParams({
      "filter.overallStatus": "TERMINATED",
      "query.term": `AREA[CompletionDate]RANGE[${FROM},${TO}]`,
      fields: "NCTId,WhyStopped,CompletionDate",
      pageSize: "1000",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`${API}?${params}`, { headers: { "User-Agent": "trials-snapshot/1.0" } });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const page = await res.json();
    for (const s of page.studies) {
      studies.push({
        id: s.protocolSection.identificationModule.nctId,
        why: s.protocolSection.statusModule.whyStopped ?? "",
      });
    }
    pageToken = page.nextPageToken;
    await new Promise((r) => setTimeout(r, 400)); // be gentle with the API
  } while (pageToken);
  return studies;
}

const studies = await fetchAll();
const counts = {};
const otherCounts = {};
const samples = {};
for (const s of studies) {
  const c = classify(s.why);
  counts[c.key] = (counts[c.key] ?? 0) + 1;
  (samples[c.key] ??= []).push(s);
  if (c.key === "other") {
    const g = classifyOther(s.why);
    otherCounts[g.key] = (otherCounts[g.key] ?? 0) + 1;
  }
}

const order = ["accrual", "business", "conduct", "covid", "external", "funding", "withdrawn", "supply", "other", "data", "none"];
const all = [...CATEGORIES, OTHER, NONE];
const snapshot = {
  fetched: new Date().toISOString().slice(0, 10),
  window: { from: FROM, to: TO, field: "completion date" },
  query: "ClinicalTrials.gov API v2, overallStatus = TERMINATED",
  total: studies.length,
  rows: order.map((key) => {
    const c = all.find((x) => x.key === key);
    return { key, reason: c.reason, group: c.group, count: counts[key] ?? 0 };
  }),
  // "Other" split into themes: biggest first, the catch-alls last
  otherBreakdown: [
    ...OTHER_SUBGROUPS.map((g) => ({ key: g.key, reason: g.reason, count: otherCounts[g.key] ?? 0 }))
      .sort((a, b) => b.count - a.count),
    { key: OTHER_VAGUE.key, reason: OTHER_VAGUE.reason, count: otherCounts[OTHER_VAGUE.key] ?? 0 },
    { key: OTHER_REST.key, reason: OTHER_REST.reason, count: otherCounts[OTHER_REST.key] ?? 0 },
  ],
};
writeFileSync(new URL("../src/data/snapshot.json", import.meta.url), JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Saved ${studies.length} trials.`);
for (const r of snapshot.rows) console.log(`${String(r.count).padStart(6)}  ${(r.count / studies.length * 100).toFixed(1).padStart(5)}%  ${r.reason}`);
console.log("Inside Other:");
for (const r of snapshot.otherBreakdown) console.log(`${String(r.count).padStart(6)}        ${r.reason}`);

if (process.argv.includes("--samples")) {
  // Print a few random examples per category, to check the rules by eye
  const pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
  for (const key of order) {
    console.log(`\n=== ${key}`);
    for (const s of pick(samples[key] ?? [], 12)) console.log(`  ${s.id}  ${s.why.slice(0, 140).replace(/\s+/g, " ")}`);
  }
}
