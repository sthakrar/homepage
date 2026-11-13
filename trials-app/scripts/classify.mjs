// classify.mjs - sorts a trial's "why stopped" text into one category.
// Used by fetch-terminations.mjs. Categories follow Williams et al.,
// PLOS ONE 2015 (Table 1), plus COVID-19, which did not exist then.

// Checked in this order; the first category whose pattern matches wins.
// Order matters: a stop because of safety or futility counts as data-driven
// even if the text also mentions enrollment; COVID-19 counts as COVID-19
// even when it caused slow enrollment.
export const CATEGORIES = [
  {
    key: "data", reason: "Benefit or harm seen", group: "The trial's own data",
    pattern: /futil|efficac|safety (concern|signal|issue|finding|reason)|adverse (event|effect|reaction)|toxicit|interim (analysis|result|data)|\bDSMB\b|\bDSMC\b|\bDMC\b|\bIDMC\b|\bAEs?\b|\bSAEs?\b|dose-limiting|data (collected )?(did not|does not|no longer) support|data (safety )?monitoring (board|committee)|lack of (benefit|response|effect)|unlikely to (meet|achieve|demonstrate|show)|(did not|didn't|failed to|does not|unable to) (meet|show|demonstrate|achieve|reach) (its |the |a |any )?(primary|secondary|pre-?specified|efficacy|clinical|statistical|endpoint|end point|benefit|significan|objective|superiority|non-?inferiority)|benefit ?[-/ ]? ?risk|risk ?[-/ ]? ?benefit|(efficacy|safety|pharmacokinetic|pk|interim|preliminary) (data|results|analysis|profile)|serious adverse|\bdeath|ineffective|not effective|no (additional |clinical |significant )?(activity|benefit|effect|efficacy|improvement|difference)|effect size|negative (result|outcome|finding)|tolerab|side effect|(unexpected|unacceptable) (risk|harm)|harm|(end ?point|objective|goal)s? (was |were )?(not |never )?(met|achieved|reached)|no efficacy|treatment response|(end ?point|objective)[^.;]{0,30}(did not|didn't|failed to) (meet|reach|achieve)|proof of concept|^safety\.?$|lack of (\w+ )?(benefit|efficacy|effect|response|activity)|(significant|significative) difference|no (positive )?results/i,
  },
  {
    key: "covid", reason: "COVID-19 pandemic", group: "Not about the trial's data",
    pattern: /covid|corona ?virus|sars-cov|pandemic/i,
  },
  {
    key: "funding", reason: "Funding", group: "Not about the trial's data",
    pattern: /fund|financ|budget|grant|money|cost/i,
  },
  {
    key: "supply", reason: "Drug supply", group: "Not about the trial's data",
    pattern: /(drug|study drug|product|device|medication|vaccine|investigational) (supply|availability|shortage|unavailab|not available|no longer available)|supply (issue|problem|shortage|chain)|devices? (expired|unavailable|no longer)|unable to (acquire|obtain|source)|manufactur/i,
  },
  {
    key: "withdrawn", reason: "Product withdrawn", group: "Not about the trial's data",
    pattern: /withdrawn from (the )?market|market withdrawal|product (was )?withdrawn|recall/i,
  },
  {
    key: "external", reason: "New outside evidence", group: "Not about the trial's data",
    pattern: /standard of care|other (trial|stud)|competing (trial|stud)|new (data|evidence|information|treatment)|external (data|information|evidence)|treatment landscape|changes? in (the )?(standard|practice|landscape|guideline)|approved (alternative|therapy)|evaluated in other|published (data|results)/i,
  },
  {
    key: "accrual", reason: "Too few patients enrolled", group: "Not about the trial's data",
    pattern: /enrol|recruit|accru|(low|slow|poor|insufficient|inadequate|limited|lack of) (participant|patient|subject|volunteer)|(no|few|not enough) (eligible )?(participant|patient|subject|volunteer)|feasib|study population|(target|sample) (size|number)|lost to follow|drop ?out|participant (interest|availability)|patient (interest|availability)|eligible (patients|participants|subjects)|inclusion|participation|lack of interest|recrut|(finding|find|identify|identifying) (eligible )?(patients|participants|subjects)|not enough \w* ?(participant|patient|subject)|required speed|returning participants|retention|no (more )?(inclusion|patients)/i,
  },
  {
    key: "business", reason: "Business or strategy", group: "Not about the trial's data",
    pattern: /business|strateg|sponsor('s)? decision|company decision|portfolio|commercial|prioriti|corporate|acquisition|merger|development (program|programme)?[^.;]{0,60}?(has been |was |is being |is )?(discontinued|stopped|terminated|halted|ended)|stop(ped)? (the )?development|decision (by|of) (the )?sponsor|discontinu\w* (the |further |clinical |drug |product )*development|terminat\w* (the |clinical |further )*development|sponsor(s)? (decided|chose|elected|is|are|has|have|considering|request)|terminated by (the )?sponsor|(sponsor|company)'?s? (reasons|request|choice)|re-?prioriti|pipeline|change in (research )?direction|management decision|company (closure|closed|shut)|internal (reasons|decision)|sponsor terminat|sponsor termination|request of (the )?sponsor|change in the development|bankrupt|dissolv|insolven|partner|(development|clinical) plans?|pursu\w* (further )?(clinical )?development|focus (on|resources)|no longer (pursu|develop)|ceased (operat|trading)|out of business|further (clinical )?development (was )?(terminated|stopped|discontinued)/i,
  },
  {
    key: "conduct", reason: "Running the trial", group: "Not about the trial's data",
    pattern: /investigator|\bPI\b|left the (institution|university|hospital)|site|staff|personnel|logist|operational|administrat|protocol|\bIRB\b|ethic|regulat|resource|study team|coordinator|feasibility issues|technical|investigational team|equipment|authorit|\bMDR\b|manpower|lack of people|work ?load|overload|device (failure|malfunction)/i,
  },
];

export const OTHER = { key: "other", reason: "Other", group: "Not about the trial's data" };
export const NONE = { key: "none", reason: "No reason given", group: "No reason given" };

// Sponsors often say what a stop was NOT about ("not due to safety
// concerns"). Those phrases are removed before looking for data-driven
// reasons, so they don't count as safety or efficacy stops.
const NEGATED = /\bnon-(safety|efficacy|scientific|medical)\b|\b(not|no|nor|without|unrelated to|none of|neither)\b[^.;]{0,80}?(safety|efficac|tolerab|toxicit|adverse|benefit|risk|harm|futil|data)[^.;,]*/gi;

// ClinicalTrials.gov's own status wording, e.g. "Study halted prematurely
// and will not resume", says that a trial stopped but not why: counted as
// no reason given.
const STATUS_ONLY = /^(terminated[\s.:;-]*)?((the )?study (was )?)?(halted prematurely|terminated( early)?|early termination|stopped)( and will not resume)?([;,.]? ?participants are no longer being examined or receiving intervention)?[\s.]*$/i;

export function classify(text) {
  const t = (text ?? "").trim();
  if (!t || STATUS_ONLY.test(t)) return NONE;
  const withoutNegations = t.replace(NEGATED, " ");
  return (
    CATEGORIES.find((c) =>
      c.pattern.test(c.key === "data" ? withoutNegations : t)
    ) ?? OTHER
  );
}
