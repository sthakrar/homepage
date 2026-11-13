// App.jsx - the page: intro, then a chart card with the donut and its legend.
// App holds one piece of state, the reason being hovered or focused, and
// shares it with both the donut and the legend so they highlight together.
import { useEffect, useRef, useState } from "react";
import { sum } from "d3";
import { data, snapshot, SOURCES } from "./data/terminations.js";
import Donut from "./components/Donut.jsx";
import Legend from "./components/Legend.jsx";
import { PAGES } from "../../shared/pages.js";

// Which page this is, for the nav bar
const PAGE = "trials";

const total = sum(data, (d) => d.count);
const accrual = data.find((d) => d.key === "accrual");
const fmt = (n) => n.toLocaleString("en-US");
const pct = (share) => `${Math.round(share * 100)}%`;
const fromYear = snapshot.window.from.slice(0, 4);
const toYear = snapshot.window.to.slice(0, 4);

// "13 November 2026"
const fetchedOn = new Date(snapshot.fetched).toLocaleDateString("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});

export default function App() {
  // On narrow screens the nav scrolls sideways: bring this page's link into view
  useEffect(() => {
    document
      .querySelector('.site-nav [aria-current="page"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, []);

  const [active, setActive] = useState(null);

  // Size the donut to its box: up to 320px, smaller on narrow screens
  const boxRef = useRef(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setSize(Math.min(320, entry.contentRect.width - 12))
    );
    observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="../" aria-label="Sanchit Thakrar, home">ST</a>
        {/* Links to the home page and every project; this page is underlined */}
        <nav className="site-nav" aria-label="Site">
          {PAGES.map((p) => (
            <a
              key={p.key}
              href={`../${p.path}`}
              title={p.title}
              aria-current={p.key === PAGE ? "page" : undefined}
            >
              {p.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="page">
        <p className="eyebrow">D3 project · Cohort 2</p>
        <h1>Why Trials Stop Early</h1>
        <p className="lede">
          Why {fmt(total)} clinical trials on ClinicalTrials.gov stopped early
          in {fromYear}-{toYear}.
        </p>

        <figure className="chart-card">
          <figcaption>
            <p className="chart-title">
              Too few patients enrolled is the top reason, behind{" "}
              {pct(accrual.count / total)} of trials
            </p>
            <p className="chart-subtitle">
              Reasons sponsors gave for {fmt(total)} trials marked terminated,
              with completion dates in {fromYear}-{toYear}
            </p>
          </figcaption>

          <div className="chart-body">
            <div className="donut-box" ref={boxRef}>
              {size > 0 && (
                <Donut
                  data={data}
                  size={size}
                  total={total}
                  active={active}
                  onActive={setActive}
                />
              )}
            </div>
            <Legend data={data} total={total} active={active} onActive={setActive} />
          </div>

          <footer className="chart-footer">
            <p>
              Data:{" "}
              <a href={SOURCES.api.url} target="_blank" rel="noopener">
                {SOURCES.api.label}
              </a>
              , downloaded {fetchedOn}. Each trial's free-text reason was sorted
              into one category by keyword rules (
              <a href={SOURCES.rules.url} target="_blank" rel="noopener">
                {SOURCES.rules.label}
              </a>
              ); checked by hand against random samples, the rules agreed about
              88% of the time, and most misses fall into "Other".
            </p>
            <p>
              Categories follow{" "}
              <a href={SOURCES.study2015.url} target="_blank" rel="noopener">
                {SOURCES.study2015.label}
              </a>
              , which sorted 905 earlier trials by hand and also found low
              enrollment the top reason. Hover a slice or a row for details.
            </p>
          </footer>
        </figure>
      </main>
    </>
  );
}
